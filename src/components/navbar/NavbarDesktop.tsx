import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import {
  ArchiveRestoreIcon,
  ArrowLeftRightIcon,
  BookIcon,
  Boxes,
  BoxesIcon,
  BoxIcon,
  Building2Icon,
  ChevronDownCircle,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  CogIcon,
  DoorOpenIcon,
  HandshakeIcon,
  HomeIcon,
  NewspaperIcon,
  PencilIcon,
  PillIcon,
  ShellIcon,
  SquareActivityIcon,
  StethoscopeIcon,
  StoreIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserCircle,
  UserCircle2Icon,
  UserIcon,
  Users2Icon,
  UserSquareIcon,
  Wallet2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import ReactSelect from "react-select";

export default function NavbarDesktop({
  children,
  session,
  partners,
}: {
  children: ReactNode;
  session: any;
  partners: any;
}) {
  const router = useRouter();

  const [subgroup, setSubgroup] = useState<any>([]);

  const navs = [
    {
      name: "Dashboard",
      href: `/main/dashboard`,
      icon: <HomeIcon />,
    },
    session?.role !== "admin_store" && {
      name: "Master Data",
      icon: <BoxIcon />,
      children: [
        {
          name: "Data Produk",
          href: `/main/product`,
        },
        {
          name: "Data Supplier",
          href: `/main/supplier`,
        },
        {
          name: "Data Toko",
          href: `/main/store`,
        },
      ],
    },
    session?.role !== "admin_store" && {
      name: "Stock",
      href: `/main/so/in`,
      icon: <ArrowLeftRightIcon />,
    },
    {
      name: "Request Toko",
      href: `/main/po`,
      icon: <ClipboardListIcon />,
    },
    session?.role !== "admin_store" && {
      name: "Pengiriman",
      href: `/main/do`,
      icon: <ArchiveRestoreIcon />,
    },
    session?.role !== "admin_store" && {
      name: "Produk Kadaluwarsa",
      href: `/main/expired`,
      icon: <TriangleAlertIcon />,
    },
    {
      name: "Daftar Resep",
      href: `/main/recipe`,
      icon: <ClipboardCheckIcon />,
    },
    {
      name: "Transaksi",
      href: `/main/transaction`,
      icon: <Boxes />,
    },
    session?.role !== "admin_store" && {
      name: "Laporan",
      icon: <ClipboardListIcon />,
      children: [
        {
          name: "Laporan Harian",
          href: `/main/report/daily`,
        }
      ],
    },
    session?.role == "super_admin" && {
      name: "Akses Admin",
      href: `/main/user`,
      icon: <Users2Icon />,
    },
    // {
    //   name: "Pengaturan",
    //   href: `/main/setting`,
    //   icon: <CogIcon />,
    // },
    session?.email?.includes("stokinventory.com") &&
      session?.is_stokinv_admin == 1 && {
        name: "Partner",
        href: `/main/partner`,
        icon: <HandshakeIcon />,
      },
  ]?.filter((v: any) => v !== false);
  return (
    <div>
      {/* Topbar */}
      <div className="bg-blue-200 w-full h-14 flex justify-end items-center px-10">
        {session?.email?.includes("@stokinventory.com") &&
        session?.role == "super_admin" ? (
          <div className="mr-4 w-1/4">
            <ReactSelect
              options={partners?.map((v: any) => ({
                ...v,
                value: v?.package_name,
                label: v?.name,
              }))}
              defaultValue={{
                value: session?.partner_code || "id.app.stokinventory",
                label:
                  partners?.find(
                    (v: any) => v?.package_name == session?.partner_code
                  ) || "stokinventory",
              }}
              onChange={(e: any) => {
                setCookie(
                  "session",
                  JSON.stringify({ ...session, partner_code: e?.value, partner: e })
                );
                router.push("");
              }}
            />
          </div>
        ) : (
          ""
        )}

        <Menu>
          <MenuButton className={"flex gap-2 items-center"}>
            <p className="text-blue-500">
              Hello, {session?.name?.toUpperCase() || "Admin"}
            </p>
            <ChevronDownCircle color="blue" className="w-4" />
          </MenuButton>
          <Transition
            enter="transition ease-out duration-75"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <MenuItems
              anchor="bottom end"
              className="w-40 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6 text-white [--anchor-gap:var(--spacing-1)] focus:outline-none"
            >
              <MenuItem>
                <button
                  type="button"
                  onClick={() => {
                    deleteCookie("session");
                    router.push("/");
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white text-red-500"
                >
                  <DoorOpenIcon className="size-4 text-red-500" />
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="bg-blue-200 w-1/5 h-[100vh] overflow-auto absolute z-10 top-0 left-0 pt-2">
          <div className="flex justify-center items-center gap-5">
            {session?.partner?.logo ? (
              <Image
                alt="logo"
                src={session?.partner?.logo}
                layout="relative"
                width={150}
                height={150}
                className="w-30 h-30"
              />
            ) : (
              <h2 className="text-blue-500 text-2xl text-center">
                {session?.partner?.name?.toUpperCase()}
              </h2>
            )}
          </div>
          <div className="px-2">
            <hr className="border-white" />
          </div>
          <div className="flex flex-col mt-5">
            {navs?.map((v: any, i:number) => {
              if (v?.children) {
                return (
                  <div className="w-full" key={i}>
                    <button
                      key={v?.name}
                      className={
                        router.pathname == v?.href
                          ? "text-xl flex gap-2 justify-between items-end bg-white p-2 text-blue-500 pl-2 w-full"
                          : "text-black text-xl flex gap-2 justify-between items-end hover:bg-white p-2 hover:text-blue-500 duration-200 transition-all pl-2 w-full"
                      }
                      type="button"
                      onClick={() => {
                        if (subgroup?.includes(v?.name)) {
                          setSubgroup(
                            subgroup?.filter(
                              (val: any) => val !== v?.name
                            )
                          );
                        } else {
                          setSubgroup([...subgroup, v?.name]);
                        }
                      }}
                    >
                      <div className="flex gap-2">
                        {v?.icon}
                        {v?.name}
                      </div>
                      <div>
                        <ChevronRightIcon className={`text-gray-500 transition-transform transform duration-500 ${subgroup?.includes(v?.name) ? "rotate-90" : "rotate-0"}`} />
                      </div>
                    </button>
                    {subgroup?.includes(v?.name) &&
                      v?.children?.map((val: any, i: number) => (
                        <button
                          key={i}
                          className={
                            router.pathname == val?.href
                              ? "text-xl flex gap-2 justify-between bg-white p-2 text-blue-500 pl-5 w-full"
                              : "text-black text-xl flex gap-2 hover:bg-white p-2 hover:text-blue-500 duration-200 transition-all pl-5 w-full"
                          }
                          type="button"
                          onClick={() => {
                            router.push(val?.href);
                          }}
                        >
                          <div className="flex gap-2">
                            {val?.icon}
                            {val?.name}
                          </div>
                        </button>
                      ))}
                  </div>
                );
              } else {
                return (
                  <button
                    key={v?.name}
                    className={
                      router.pathname == v?.href
                        ? "text-xl flex gap-2 justify-between bg-white p-2 text-blue-500 pl-2"
                        : "text-black text-xl flex gap-2 hover:bg-white p-2 hover:text-blue-500 duration-200 transition-all pl-2"
                    }
                    type="button"
                    onClick={() => {
                      router.push(v?.href);
                    }}
                  >
                    <div className="flex gap-2">
                      {v?.icon}
                      {v?.name}
                    </div>
                  </button>
                );
              }
            })}
          </div>
        </div>
        <main className="container mt-5 ml-[280px] px-10 h-[85vh] w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
