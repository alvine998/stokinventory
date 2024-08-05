import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { deleteCookie, getCookie } from "cookies-next";
import {
  ArchiveRestoreIcon,
  ArrowLeftRightIcon,
  BookIcon,
  BoxesIcon,
  BoxIcon,
  Building2Icon,
  ChevronDownCircle,
  ClipboardListIcon,
  CogIcon,
  DoorOpenIcon,
  HandshakeIcon,
  HomeIcon,
  NewspaperIcon,
  PencilIcon,
  PillIcon,
  SquareActivityIcon,
  StethoscopeIcon,
  StoreIcon,
  TriangleAlertIcon,
  UserCircle,
  UserCircle2Icon,
  UserIcon,
  Users2Icon,
  UserSquareIcon,
  Wallet2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

export default function NavbarDesktop({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  const router = useRouter();

  const navs = [
    {
      name: "Dashboard",
      href: `/main/dashboard`,
      icon: <HomeIcon />,
    },
    {
      name: "Data Produk",
      href: `/main/product`,
      icon: <BoxIcon />,
    },
    {
      name: "Data Toko",
      href: `/main/store`,
      icon: <StoreIcon />,
    },
    {
      name: "Produk Kadaluwarsa",
      href: `/main/expired`,
      icon: <TriangleAlertIcon />,
    },
    {
      name: "Stock",
      href: `/main/so`,
      icon: <ArrowLeftRightIcon />,
    },
    {
      name: "Order",
      href: `/main/po`,
      icon: <ClipboardListIcon />,
    },
    {
      name: "Delivery",
      href: `/main/do`,
      icon: <ArchiveRestoreIcon />,
    },
    {
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
  ]?.filter((v: any) => v !== undefined);
  return (
    <div>
      {/* Topbar */}
      <div className="bg-blue-200 w-full h-10 flex justify-end items-center px-10">
        {/* <button className='flex items-center gap-2'>
                   
                </button> */}
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
        <div className="bg-blue-200 w-1/5 h-[100vh] absolute z-10 top-0 left-0 pt-2">
          <div className="flex justify-center items-center gap-5">
            {session?.logo ? (
              <Image
                alt="logo"
                src={session?.logo}
                layout="relative"
                width={150}
                height={150}
                className="w-30 h-30"
              />
            ) : (
              <h2 className="text-blue-500 text-2xl text-center">StokInventory</h2>
            )}
          </div>
          <div className="flex flex-col mt-5">
            {navs?.map((v: any) => (
              <button
                key={v?.name}
                className={
                  router.pathname == v?.href
                    ? "text-xl flex gap-2 bg-white p-2 text-blue-500 pl-2"
                    : "text-black text-xl flex gap-2 hover:bg-white p-2 hover:text-blue-500 duration-200 transition-all pl-2"
                }
                type="button"
                onClick={() => {
                  router.push(v?.href);
                }}
              >
                {v?.icon}
                {v?.name}
              </button>
            ))}
          </div>
        </div>
        <main className="container mt-5 ml-[280px] px-10 h-[90vh] w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
