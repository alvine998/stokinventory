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

      {/* Layanan */}
      <div className="mt-10 px-10">
        <h2 className="text-3xl font-sans font-bold text-blue-600 text-center">
          Layanan
        </h2>

        <div className="flex items-start justify-between gap-4 mt-5">
          <div className="bg-blue-600 rounded-lg w-full p-2 py-6">
            <h5 className="text-white text-xl text-center font-semibold">
              Paket Basic
            </h5>
            <h5 className="text-white text-2xl text-center font-bold">
              Rp 50.000 / Bulan
            </h5>
            <ol className="lg:ml-10 mt-4">
              <li className="list-disc text-lg text-white">
                Manajemen stok dasar
              </li>
              <li className="list-disc text-lg text-white">
                Pelacakan barang masuk & keluar
              </li>
              <li className="list-disc text-lg text-white">
                Laporan stok harian
              </li>
              <li className="list-disc text-lg text-white">
                Dukungan pelanggan melalui email & telepon
              </li>
              <li className="list-disc text-lg text-white">
                Akses hingga 2 pengguna
              </li>
            </ol>

            <div className="flex justify-center items-center">
              <button className="text-blue-600 rounded-full bg-white px-6 py-2 mt-6">
                Pesan Sekarang
              </button>
            </div>
          </div>
          <div className="bg-blue-600 rounded-lg w-full p-2 py-6">
            <h5 className="text-white text-xl text-center font-semibold">
              Paket Pro
            </h5>
            <h5 className="text-white text-2xl text-center font-bold">
              Rp 75.000 / Bulan
            </h5>
            <ol className="lg:ml-10 mt-4">
              <li className="list-disc text-lg text-white">
                Semua fitur Paket Basic
              </li>
              <li className="list-disc text-lg text-white">
                Integrasi barcode/QR code scanner
              </li>
              <li className="list-disc text-lg text-white">
                Laporan stok bulanan dan tren penjualan
              </li>
              <li className="list-disc text-lg text-white">
                Manajemen multi-gudang
              </li>
              <li className="list-disc text-lg text-white">
                Dukungan pelanggan melalui email dan chat
              </li>
              <li className="list-disc text-lg text-white">
                Akses hingga 5 pengguna
              </li>
            </ol>

            <div className="flex justify-center items-center">
              <button className="text-blue-600 rounded-full bg-white px-6 py-2 mt-6">
                Pesan Sekarang
              </button>
            </div>
          </div>
          <div className="bg-blue-600 rounded-lg w-full p-2 py-6">
            <h5 className="text-white text-xl text-center font-semibold">
              Paket Enterprise
            </h5>
            <h5 className="text-white text-2xl text-center font-bold">
              Rp 99.000 / Bulan
            </h5>
            <ol className="lg:ml-10 mt-4">
              <li className="list-disc text-lg text-white">
                Semua fitur Paket Pro
              </li>
              <li className="list-disc text-lg text-white">
                Notifikasi stok minimum dan otomatisasi pemesanan
              </li>
              <li className="list-disc text-lg text-white">
                Integrasi dengan sistem ERP
              </li>
              <li className="list-disc text-lg text-white">Pelaporan kustom</li>
              <li className="list-disc text-lg text-white">
                Akses tidak terbatas untuk pengguna
              </li>
              <li className="list-disc text-lg text-white">
                Dukungan prioritas 24/7 (email, chat, dan telepon)
              </li>
            </ol>

            <div className="flex justify-center items-center">
              <button className="text-blue-600 rounded-full bg-white px-6 py-2 mt-6">
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
