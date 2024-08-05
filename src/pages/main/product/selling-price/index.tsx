import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  ArrowLeftCircle,
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { page, size, search } = context.query;
    const { req, res } = context;
    let session: any = getCookie("session", { req, res });
    if (session) {
      session = JSON.parse(session);
    }
    const result = await axios.get(
      CONFIG.base_url_api +
        `/products?page=${+page || 1}&size=${+size || 10}&search=${
          search || ""
        }`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    return {
      props: {
        table: result?.data || [],
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

export default function Medicine({ table }: any) {
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
      name: "Kode",
      sortable: true,
      selector: (row: any) => row?.code || "-",
    },
    {
      name: "Nama Produk",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "Harga Modal",
      sortable: true,
      selector: (row: any) => toMoney(row?.price) || "-",
    },
    {
      name: "40%",
      sortable: true,
      selector: (row: any) => toMoney((row?.price * 0.4) + row?.price) || "0",
    },
    {
      name: "50%",
      sortable: true,
      selector: (row: any) => toMoney((row?.price * 0.5) + row?.price) || "0",
    },
    {
      name: "60%",
      sortable: true,
      selector: (row: any) => toMoney((row?.price * 0.6) + row?.price) || "0",
    },
    {
      name: "70%",
      sortable: true,
      selector: (row: any) => toMoney((row?.price * 0.7) + row?.price) || "0",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold">Perkiraan Harga Jual</h2>

      <div className="mt-5">
        <div className="flex lg:flex-row flex-col justify-between items-center">
          <div className="lg:w-auto w-full">
            <Button
              type="button"
              color="white"
              className={
                "flex gap-2 px-2 items-center lg:justify-start justify-center"
              }
              onClick={() => {
                router.push(`/main/product`)
              }}
            >
              <ArrowLeftCircle className="w-4" />
              Kembali
            </Button>
          </div>
          <div className="lg:w-auto w-full">
            <Input
              label=""
              type="search"
              placeholder="Cari disini..."
              defaultValue={filter?.search}
              onChange={(e) => {
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
                setFilter({ ...filter, page: currentPage, limit: currentRow });
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
