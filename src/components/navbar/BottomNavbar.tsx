import Link from "next/link";
import React from "react";

export default function BottomNavbar() {
  return (
    <div className="bg-blue-300 h-[300px] w-full px-10 py-10 relative">
      <div className="flex gap-[100px]">
        <div>
          <Link className="text-3xl text-blue-700 font-bold font-sans" href="/">
            STOKINVENTORY.COM
          </Link>
        </div>

        <div className="flex justify-between gap-4">
          <div className="w-[200px]">
            <h5 className="text-lg text-blue-700 font-bold font-sans">
              Layanan
            </h5>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Paket UMKM
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Paket Personal Bisnis
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Paket Warehouse Program
                </button>
              </Link>
            </div>
          </div>

          <div className="w-[200px]">
            <h5 className="text-lg text-blue-700 font-bold font-sans">
              Navigasi
            </h5>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Tentang Kami
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Hubungi Kami
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  FAQ
                </button>
              </Link>
            </div>
          </div>

          <div className="w-[200px]">
            <h5 className="text-lg text-blue-700 font-bold font-sans">
              Kontak
            </h5>
          </div>

          <div className="w-[200px]">
            <h5 className="text-lg text-blue-700 font-bold font-sans">
              Lokasi
            </h5>
          </div>
        </div>
      </div>

      <p className="text-center absolute bottom-2 right-0 left-0">&copy; alvinecom 2024</p>
    </div>
  );
}
