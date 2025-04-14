import Button from "@/components/Button";
import FileUpload from "@/components/FileUpload";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import Radio from "@/components/Radio";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { storage } from "@/config/firebase";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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

export default function SOTabs({ children }: any) {
  const router = useRouter();
  let navs = [
    {
      label: "Barang Masuk",
      value: "in",
      href: "/main/so/in",
    },
    {
      label: "Barang Keluar",
      value: "out",
      href: "/main/so/out",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold">Stock</h2>

      <div className="mt-5">
        <div className="flex gap-2">
          {navs?.map((v: any, i: number) => (
            <Button
              className={
                router.pathname?.includes(v?.href)
                  ? "bg-blue-500"
                  : "bg-blue-700 hover:bg-blue-500"
              }
              key={i}
              color="tabs"
              type="button"
              onClick={() => {
                router.push(v?.href);
              }}
            >
              {v?.label}
            </Button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
