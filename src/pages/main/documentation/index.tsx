import Button from "@/components/Button";
import generateInvoice from "@/components/GenerateInvoice";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import jsPDF from "jspdf";
import {
  CircleDivideIcon,
  ClipboardList,
  PencilIcon,
  PlusIcon,
  PrinterIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
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

    return {
      props: {
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

export default function Documentation({ session }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  return (
    <div>
      <h2 className="text-2xl font-semibold">Dokumentasi</h2>
      <div className="shadow mt-2 py-2 px-4 rounded">
        <p>
          Halaman dokumentasi ini menyediakan panduan lengkap mengenai fitur,
          konfigurasi, dan penggunaan sistem secara teknis maupun fungsional.
          Dirancang untuk membantu developer, administrator, dan pengguna dalam
          memahami dan mengimplementasikan solusi secara efisien.
        </p>
      </div>

      <div className="mt-2">
        {/* <div className="flex lg:flex-row flex-col justify-between items-center">
          <div className="w-full">
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
        </div> */}
        <div className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Link
              href={"https://youtu.be/Uvxd8rcn5UU"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Dashboard
            </Link>
            <Link
              href={"https://youtu.be/AlZhNHaUidc"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Data Produk
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Data Toko
            </Link>
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Data Supplier
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Stok Barang Masuk
            </Link>
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Stok Barang Keluar
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Refund Produk
            </Link>
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Request Toko
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Pengiriman
            </Link>
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Produk Kadaluwarsa
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Transaksi
            </Link>
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Laporan Harian
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
            <Link
              href={"https://youtube.com/"}
              className="text-blue-500 font-bold text-2xl shadow p-2 rounded w-full text-center hover:bg-gray-200 duration-150 transition-all"
              target="_blank"
            >
              Akses Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
