import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import axios from "axios";
import {
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
    const { page, limit, search } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/diseases/list?page=${+page || 1}&limit=${+limit || 10}&search=${
          search || ""
        }`
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

export default function Setting({ table }: any) {
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
      name: "Nama Penyakit",
      sortable: true,
      selector: (row: any) => row?.name,
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
        result = await axios.patch(
          CONFIG.base_url_api + `/diseases/update/${formData?.id}`,
          payload
        );
      } else {
        result = await axios.post(
          CONFIG.base_url_api + `/diseases/create`,
          payload
        );
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

  const colors = [
    "bg-blue-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-green-500",
    "bg-gray-500",
    "bg-violet-500",
  ];
  return (
    <div>
      <h2 className="text-2xl font-semibold">Pengaturan</h2>

      <div className="mt-5">
        <div className="pl-3">
          <div>
            <h5 className="text-gray-500">Warna Dashboard</h5>
            <div className="flex gap-2 mt-2">
              {colors?.map((v: any, i: number) => (
                <button
                  className={`w-10 h-10 rounded-full hover:ring hover:ring-blue-400 duration-200 transition-all ${v}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
