import Button from "@/components/Button";
import Input from "@/components/Input";
import NavbarHomeDesktop from "@/components/navbar/NavbarHomeDesktop";
import { CONFIG } from "@/config";
import axios from "axios";
import { setCookie } from "cookies-next";
import { BoxesIcon, ClipboardCheckIcon, TruckIcon } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const packages = [
    {
      name: "Basic",
      price: 50000,
      features: [
        "Manajemen stok dasar",
        "Pelacakan barang masuk & keluar",
        "Laporan stok harian",
        "Dukungan pelanggan melalui email & telepon",
        "Akses hingga 2 toko",
      ],
    },
    {
      name: "Pro",
      price: 75000,
      features: [
        "Semua fitur Paket Basic",
        "Integrasi barcode/QR code scanner",
        "Laporan stok bulanan dan tren penjualan",
        "Manajemen multi-gudang",
        "Dukungan pelanggan melalui email dan chat",
        "Akses hingga 5 toko",
      ],
    },
    {
      name: "Enterprise",
      price: 99000,
      features: [
        "Semua fitur Paket Pro",
        "Notifikasi stok minimum dan otomatisasi pemesanan",
        "Integrasi dengan sistem ERP",
        "Pelaporan kustom",
        "Akses tidak terbatas untuk banyak toko",
        "Dukungan prioritas 24/7 (email, chat, dan telepon)",
      ],
    },
  ];

  const features = [
    {
      id: 1,
      icon: <TruckIcon className="text-blue-600" />,
      title: "Fitur Tracking Barang",
      desc: "Dengan fitur ini, Anda dapat melacak pergerakan barang dari gudang ke lokasi tujuan dengan mudah. Anda akan mendapatkan notifikasi setiap kali barang keluar atau masuk.",
    },
    {
      id: 2,
      icon: <BoxesIcon className="text-blue-600" />,
      title: "Fitur Manajemen Stok",
      desc: "Fitur ini memungkinkan Anda untuk mengelola stok barang dengan lebih efisien. Anda dapat melihat jumlah stok yang tersedia, melakukan pemesanan ulang, dan mendapatkan laporan tentang pergerakan stok.",
    },
    {
      id: 3,
      icon: <ClipboardCheckIcon className="text-blue-600" />,
      title: "Fitur Laporan Stok",
      desc: "Dengan fitur ini, Anda dapat menghasilkan laporan stok secara otomatis. Anda dapat melihat laporan harian, mingguan, atau bulanan untuk membantu Anda dalam pengambilan keputusan.",
    },
  ];

  const partners = [
    {
      id: 1,
      img: "/images/pt-1.png",
    },
    {
      id: 2,
      img: "/images/pt-2.png",
    },
    {
      id: 3,
      img: "/images/pt-3.png",
    },
    {
      id: 4,
      img: "/images/pt-4.png",
    },
    {
      id: 5,
      img: "/images/pt-5.png",
    },
  ];

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center md:flex-row flex-col-reverse">
        <div className="md:px-20 px-2 md:mt-0 mt-10">
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
        <div className="w-full md:pr-10 pr-0">
          <img alt="warehouse" src="/images/warehouse.jpg" />
        </div>
      </div>

      <div className="border-b-2 border-gray-600 w-1/2 mx-auto mt-20"></div>

      {/* Layanan */}
      <div className="mt-10 md:px-10 px-2">
        <h2 className="text-3xl font-sans font-bold text-blue-600 text-center">
          Layanan
        </h2>

        <div className="flex items-start justify-between gap-4 mt-5 md:flex-row flex-col">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-blue-600 rounded-lg w-full p-2 py-6 mt-0 hover:-mt-2 transition-all duration-300"
            >
              <h5 className="text-white text-xl text-center font-semibold">
                Paket {pkg.name}
              </h5>
              <h5 className="text-white text-2xl text-center font-bold">
                Rp {pkg.price.toLocaleString("id-ID")} / Bulan
              </h5>
              <ol className="lg:ml-10 mt-4">
                {pkg.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="list-disc text-lg text-white md:text-left text-center"
                  >
                    {feature}
                  </li>
                ))}
              </ol>

              <div className="flex justify-center items-center">
                <button className="text-blue-600 rounded-full bg-white px-6 py-2 mt-6">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b-2 border-gray-600 w-1/2 mx-auto mt-20"></div>

      {/* Fitur Unggulan */}
      <div className="md:mt-10 mt-10 md:px-10 px-2">
        <h2 className="text-3xl font-sans font-bold text-blue-600 text-center">
          Fitur Unggulan
        </h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 md:mt-10 mt-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-start justify-between gap-4 mt-5 bg-white shadow-lg rounded-lg p-4 hover:-mt-2 transition-all duration-300 cursor-pointer"
            >
              <div className="text-blue-600 text-3xl">{feature.icon}</div>
              <div className="flex flex-col">
                <h5 className="text-xl font-semibold">{feature.title}</h5>
                <p className="text-lg text-left">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner */}

      {/* <div className="border-b-2 border-gray-600 w-1/2 mx-auto mt-20"></div>
      <div className="md:mt-10 mt-10 md:px-10 px-2">
        <h2 className="text-3xl font-sans font-bold text-blue-600 text-center">
          Partner Kami
        </h2>
        <div className="flex items-center justify-center gap-4 mt-5 md:flex-row flex-col">
          {partners.map((pkg, index) => (
            <div
              key={index}
              className="bg-white rounded-lg w-full p-2 py-6 mt-0 hover:-mt-2 transition-all duration-300"
            >
              <img
                alt="partner"
                src={pkg.img}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
