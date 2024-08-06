import Button from "@/components/Button";
import FileUpload from "@/components/FileUpload";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import Radio from "@/components/Radio";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
  UploadCloudIcon,
  XCircleIcon,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ReactSelect from "react-select";
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
        `/stocks?page=${+page || 1}&size=${+size || 10}&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const products = await axios.get(
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
        products: products.data?.items || [],
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

export default function Medicine({ table, session, products }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [list, setList] = useState<any>([]);
  const [image, setImage] = useState<any>({
    data: "",
    preview: "",
  });
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
      name: "Waktu",
      sortable: true,
      selector: (row: any) => row?.date,
    },
    {
      name: "Jenis Stok",
      sortable: true,
      selector: (row: any) =>
        row?.type == "in" ? "Barang Masuk" : "Barang Keluar",
    },
    {
      name: "Bukti",
      sortable: true,
      selector: (row: any) => (
        <a href={row?.image} className="text-blue-500">
          Lihat
        </a>
      ),
    },
    {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2">
          <Button
            title="Edit"
            color="primary"
            onClick={() => {
              setModal({ ...modal, open: true, data: row, key: "update" });
            }}
          >
            <PencilIcon className="text-white w-5 h-5" />
          </Button>
          <Button
            title="Hapus"
            color="danger"
            onClick={() => {
              setModal({ ...modal, open: true, data: row, key: "delete" });
            }}
          >
            <TrashIcon className="text-white w-5 h-5" />
          </Button>
        </div>
      ),
    },
  ];

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        ...formData,
      };
      let result: any = null;
      if (formData?.id) {
        result = await axios.patch(CONFIG.base_url_api + `/stock`, payload, {
          headers: {
            "bearer-token": "stokinventoryapi",
            "x-partner-code": session?.partner_code,
          },
        });
      } else {
        result = await axios.post(CONFIG.base_url_api + `/stock`, payload, {
          headers: {
            "bearer-token": "stokinventoryapi",
            "x-partner-code": session?.partner_code,
          },
        });
      }
      if (result.data[1] == 400) {
        Swal.fire({
          icon: "warning",
          text: "Data Sudah Tersedia",
        });
      } else {
        Swal.fire({
          icon: "success",
          text: "Data Berhasil Disimpan",
        });
      }
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        text: error?.message || "Error",
      });
    }
  };
  const onRemove = async (e: any) => {
    try {
      e?.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      const result = await axios.delete(
        CONFIG.base_url_api + `/stock?id=${formData?.id}`,
        {
          headers: {
            "bearer-token": "stokinventoryapi",
            "x-partner-code": session?.partner_code,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Dihapus",
      });
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error) {
      console.log(error);
    }
  };
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
