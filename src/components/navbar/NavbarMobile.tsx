import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArchiveRestoreIcon,
  ArrowLeftRightIcon,
  BookIcon,
  BoxesIcon,
  BoxIcon,
  Building2Icon,
  ChevronDownCircle,
  ClipboardCheckIcon,
  ClipboardListIcon,
  CogIcon,
  DoorOpenIcon,
  HomeIcon,
  MenuIcon,
  NewspaperIcon,
  PencilIcon,
  PillIcon,
  SquareActivityIcon,
  StethoscopeIcon,
  StoreIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserCircle,
  UserCircle2Icon,
  UserIcon,
  Users2Icon,
  Wallet2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

export default function NavbarMobile({
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
    session?.role !== "admin_store" && {
      name: "Data Supplier",
      href: `/main/supplier`,
      icon: <TruckIcon />,
    },
    session?.role !== "admin_store" && {
      name: "Data Toko",
      href: `/main/store`,
      icon: <StoreIcon />,
    },
    session?.role !== "admin_store" && {
      name: "Stock",
      href: `/main/so/in`,
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
      name: "Produk Kadaluwarsa",
      href: `/main/expired`,
      icon: <TriangleAlertIcon />,
    },
    {
      name: "Daftar Resep",
      href: `/main/recipe`,
      icon: <ClipboardCheckIcon />,
    },
    session?.role == "super_admin" &&{
      name: "Akses Admin",
      href: `/main/user`,
      icon: <Users2Icon />,
    },
    //   {
    //     name: "Pengaturan",
    //     href: `/main/setting`,
    //     icon: <CogIcon />,
    //   },
    session?.email?.includes("stokinventory.com") &&
      session?.is_stokinv_admin == 1 && {
        name: "Akses Admin",
        href: `/main/user`,
        icon: <Users2Icon />,
      },
  ]?.filter((v: any) => v !== false);
  return (
    <div className="overflow-hidden">
      {/* Topbar */}
      <div className="bg-blue-200 w-full h-14 flex items-center px-2">
        <Menu>
          <MenuButton
            className={"flex gap-2 items-center justify-between w-full"}
          >
            {session?.logo ? (
              <Image
                alt="logo"
                src={session?.logo}
                layout="relative"
                width={100}
                height={100}
                className="w-15 h-15"
              />
            ) : (
              <p className="text-white text-xl">StokInventory</p>
            )}
            {/* <Image alt='logo' src={'/images/tokotitoh.png'} layout='relative' width={300} height={300} className='w-10 h-10' /> */}
            <MenuIcon color="blue" className="w-7" />
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
              className="w-full mt-5 min-h-screen origin-top-right rounded-xl border border-white/5 bg-white p-1 text-white [--anchor-gap:var(--spacing-1)] focus:outline-none"
            >
              {navs?.map((v: any) => (
                <MenuItem key={v?.name}>
                  <button
                    type="button"
                    className={
                      router?.pathname?.includes(v?.href)
                        ? "group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-blue-200 text-blue-500"
                        : `group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-white ${
                            v?.name == "Logout" ? "text-red-500" : "text-black"
                          }`
                    }
                    onClick={() => {
                      router.push(v?.href);
                    }}
                  >
                    {v?.icon}
                    {v?.name}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <div className="flex">
        <main className="container mt-5 px-5 h-full w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
