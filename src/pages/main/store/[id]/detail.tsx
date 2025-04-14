import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import { ArrowLeftCircleIcon } from "lucide-react";
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
    let stock: any = await axios.get(
      CONFIG.base_url_api + `/stocks?store_id=${params?.id}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const detail = await axios.get(
      CONFIG.base_url_api + `/stores?id=${params?.id}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
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
    qty = qty?.reduce((a: any, b: any) => {
      const exist = a?.find((v: any) => v?.id == b?.id);
      if (exist) {
        exist.stock += b.qty;
      } else {
        a.push({ id: b.id, name: b.name, code: b.code, stock: b.qty });
      }
      return a
    }, []);
    return {
      props: {
        table: product?.data || [],
        detail: detail?.data?.items[0],
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

export default function Medicine({ table, session, detail, stock }: any) {
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
  const CustomerColumn: any = [
    {
      name: "Nama Produk",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "Stok",
      sortable: true,
      selector: (row: any) => (stock?.find((v:any) => v?.id == row?.id)?.stock || 0) + ` ${row?.unit}` ,
    },
    // {
    //   name: "Masa Kadaluwarsa",
    //   sortable: true,
    //   selector: (row: any) => row?.expired_at || "-",
    // },
    {
      name: "Status",
      sortable: true,
      selector: (row: any) => row?.status || "-",
    },
  ];

  return (
    <div>
      <div className="mt-5">
        <div className="flex lg:flex-row flex-col justify-between items-center">
          <div>
            <Button
              type="button"
              onClick={() => {
                router.push("/main/store");
              }}
              className={"px-4 flex gap-2 items-center"}
              color="white"
            >
              <ArrowLeftCircleIcon />
              Kembali
            </Button>
          </div>
        </div>
        <div className="w-full py-4 px-4 bg-white border rounded">
          <h2 className="text-2xl font-semibold">Detail Toko</h2>
          <div className="flex flex-wrap flex-row gap-2 mt-5">
            <div className="w-[370px] border-b-2 border-b-gray-600">
              <p>
                Kode Toko: <br />
                {detail?.code}
              </p>
            </div>
            <div className="w-[370px] border-b-2 border-b-gray-600">
              <p>
                Nama Toko: <br />
                {detail?.name}
              </p>
            </div>
            <div className="w-[370px] border-b-2 border-b-gray-600">
              <p>
                Alamat: <br />
                {detail?.address}
              </p>
            </div>
          </div>
        </div>
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
              columns={CustomerColumn}
              data={table?.items}
              customStyles={CustomTableStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
