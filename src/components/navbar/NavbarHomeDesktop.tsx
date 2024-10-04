import { useRouter } from "next/router";
import React from "react";
import BottomNavbar from "./BottomNavbar";

interface Props {
  children: any;
}

export default function NavbarHomeDesktop(props: Props) {
  const { children } = props;
  const router = useRouter();
  const tabs = [
    {
      name: "Beranda",
      href: "/",
    },
    {
      name: "Layanan",
      href: "/our-service",
    },
    {
      name: "Tentang Kami",
      href: "/about-us",
    },
    {
      name: "Kontak Kami",
      href: "/contact-us",
    },
    {
      name: "FAQ",
      href: "/faq",
    },
    {
      name: "Member Area",
      href: "/login",
    },
  ];
  return (
    <div>
      <div className="bg-blue-300 w-full h-20 flex justify-center items-center gap-40">
        <a className="text-3xl text-blue-700 font-bold font-sans" href="/">
          STOKINVENTORY.COM
        </a>
        <div className="flex gap-6">
          {tabs?.map((v: any, i: number) => (
            <a
              href={v?.href}
              key={i}
              className={`text-lg font-bold font-sans ${
                v?.href == router.pathname
                  ? "text-blue-600"
                  : v?.href == "/login"
                  ? "text-white"
                  : "hover:text-blue-600 text-white"
              } ${
                v?.href == "/login" ? "bg-blue-600 p-2 rounded" : "mt-2"
              } duration-200 transition-all`}
            >
              {v?.name}
            </a>
          ))}
        </div>
      </div>
      <div className="p-2">{children}</div>
      <div className="mt-10">
          <BottomNavbar/>
      </div>
    </div>
  );
}
