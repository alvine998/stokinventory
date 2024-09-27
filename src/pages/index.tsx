import Button from "@/components/Button";
import Input from "@/components/Input";
import NavbarHomeDesktop from "@/components/navbar/NavbarHomeDesktop";
import { CONFIG } from "@/config";
import axios from "axios";
import { setCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <div className="px-20">
          <h2 className="text-3xl font-sans font-bold text-blue-600">
            Aplikasi Manajemen Gudang No 1 di Indonesia
          </h2>
          <p className="text-lg font-semibold text-blue-600 mt-4 text-justify">
            Bersama StokInventory anda dapat mengelola sistem pergudangan dari
            hulu ke hilir, dari supplier sampai ke retail.
          </p>

          <button className="text-white bg-blue-600 duration-200 transition-all hover:bg-white  hover:text-blue-600 hover:border-2 hover:border-blue-800 rounded-full px-6 py-2 mt-6">
            Selengkapnya
          </button>
        </div>
        <div className="w-full pr-10">
          <img alt="warehouse" src="/images/warehouse.jpg" />
        </div>
      </div>

      <div className="border-b-2 border-gray-600 w-1/2 mx-auto mt-20"></div>
    </div>
  );
}
