import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import axios from "axios";
import { getCookie } from "cookies-next";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

export async function getServerSideProps(context: any) {
  try {
    const { page, size, search } = context.query;
    const { req, res, params } = context;
    let session: any = getCookie("session", { req, res });
    if (session) {
      session = JSON.parse(session);
    }
    let stock: any = await axios.get(CONFIG.base_url_api + `/stocks?type=in`, {
      headers: {
        "bearer-token": "stokinventoryapi",
        "x-partner-code": session?.partner_code,
      },
    });
    const product = await axios.get(
      CONFIG.base_url_api +
        `/products?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    let qty = [];
    stock = stock?.data?.items;
    for (let index = 0; index < stock.length; index++) {
      const element = stock[index];
      qty.push(...JSON.parse(element?.products));
    }
    console.log(qty);
    qty = qty?.reduce((a: any, b: any) => {
      const exist = a?.find((v: any) => v?.id == b?.id);
      if (exist) {
        // Check if the existing item's expiration date is still valid
        const expired_date = moment(exist.expired_at);
        if (moment().isBefore(expired_date)) {
          // If the item is not expired, add the quantity
          exist.stock += b.qty;
        } else {
          // If the item is expired, treat it as a new entry
          a.push({
            id: b.id,
            name: b.name,
            code: b.code,
            stock: b.qty,
            expired_at: b.expired_at,
          });
        }
      } else {
        a.push({ id: b.id, name: b.name, code: b.code, stock: 0 });
      }
      return a;
    }, []);
    return {
      props: {
        table: product?.data || [],
        stock: qty || [],
        session,
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      props: {
        error: "Error internal server",
      },
    };
  }
}

export default function Medicine({ table, session, stock }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);
  const Column: any = [
    {
      name: "Nama Produk",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "Kode Produk",
      sortable: true,
      selector: (row: any) => row?.code,
    },
    {
      name: "Stok Kadaluwarsa",
      sortable: true,
      selector: (row: any) =>
        (stock?.find((v: any) => row?.id == v?.id)?.stock || 0) +
        ` ${row?.unit}`,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold">Produk Kadaluwarsa</h2>

      <div className="mt-5">
        <div className="flex lg:flex-row flex-col justify-between items-center">
          <div className="lg:w-auto w-full">
            <Input
              label=""
              type="search"
              placeholder="Cari disini..."
              defaultValue={filter?.search}
              onChange={(e: any) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          {show && (
            <DataTable
              pagination
              onChangePage={(pageData) => {
                setFilter({ ...filter, page: pageData });
              }}
              onChangeRowsPerPage={(currentRow, currentPage) => {
                setFilter({ ...filter, page: currentPage, size: currentRow });
              }}
              responsive={true}
              paginationTotalRows={table?.total_items}
              paginationDefaultPage={1}
              paginationServer={true}
              striped
              columns={Column}
              data={table?.items}
              customStyles={CustomTableStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
