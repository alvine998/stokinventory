import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneCallIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function BottomNavbar() {
  return (
    <div className="bg-blue-300 md:h-[350px] h-auto max-w-full md:px-10 md:py-10 px-2 py-2 relative">
      <div className="flex gap-[40px] md:flex-row flex-col">
        <div className="md:w-[600px] w-full">
          <Link
            className="text-3xl text-blue-700 font-bold font-sans md:text-left text-center"
            href="/"
          >
            STOKINVENTORY.COM
          </Link>
          <div className="mt-2">
            <p className="text-justify">
              StokInventory adalah aplikasi web yang dirancang untuk memudahkan
              proses monitoring dan pengelolaan stok di gudang. Aplikasi ini
              memberikan solusi praktis bagi bisnis dalam melacak persediaan
              barang secara real-time, mengurangi risiko kekurangan atau
              kelebihan stok, dan meningkatkan efisiensi operasional.
            </p>
          </div>
        </div>

        <div className="flex justify-start gap-4 w-full md:flex-row flex-col md:mb-0 mb-10">
          <div className="md:w-[180px] w-full md:px-0 px-4">
            <h5 className="text-lg text-blue-700 font-bold font-sans">
              Layanan
            </h5>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Paket Basic
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Paket Pro
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  Paket Enterprise
                </button>
              </Link>
            </div>
          </div>

          <div className="md:w-[180px] w-full md:px-0 px-4">
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

          <div className="md:w-[180px] w-full md:px-0 px-4">
            <h5 className="text-lg text-blue-700 font-bold font-sans">
              Kontak
            </h5>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={"/"}>
                <button className="text-white w-full flex gap-2 justify-center items-center text-xs p-2 rounded hover:ml-2 hover:bg-red-500 duration-200 transition-all bg-red-700">
                  <MailIcon className="w-4" />
                  Email
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full flex gap-2 justify-center items-center text-xs p-2 rounded hover:ml-2 hover:bg-blue-500 duration-200 transition-all bg-blue-700">
                  <FacebookIcon className="w-4" />
                  Facebook
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full flex gap-2 justify-center items-center text-xs p-2 rounded hover:ml-2 hover:bg-green-500 duration-200 transition-all bg-green-700">
                  <PhoneCallIcon className="w-4" />
                  Whatsapp
                </button>
              </Link>
              <Link href={"/"}>
                <button className="text-white w-full flex gap-2 justify-center items-center text-xs p-2 rounded hover:ml-2 hover:bg-violet-500 duration-200 transition-all bg-violet-700">
                  <InstagramIcon className="w-4" />
                  Instagram
                </button>
              </Link>
            </div>
          </div>

          <div className="md:w-[180px] w-full md:px-0 px-4">
            <h5 className="text-lg text-blue-700 font-bold font-sans">
              Lokasi
            </h5>
            <div className="mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d990.0523278315974!2d107.63145639837235!3d-6.984606640667532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1728374758801!5m2!1sid!2sid"
                allowFullScreen
                className="md:w-[370px] w-full md:h-[200px] h-[200px] rounded-lg"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center font-bold absolute md:bottom-2 bottom-2 right-0 left-0">
        &copy;FQLABS.ID 2024
      </p>
    </div>
  );
}
