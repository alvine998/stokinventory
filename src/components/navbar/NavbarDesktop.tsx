import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { deleteCookie, getCookie } from 'cookies-next';
import { BookIcon, Building2Icon, ChevronDownCircle, DoorOpenIcon, HomeIcon, NewspaperIcon, PencilIcon, PillIcon, SquareActivityIcon, UserCircle, UserCircle2Icon, UserIcon, Users2Icon, Wallet2Icon } from 'lucide-react'
import Image from 'next/image';
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

export default function NavbarDesktop({ children, session }: { children: ReactNode, session: any }) {
    const router = useRouter();

    const navs = [
        {
            name: "Dashboard",
            href: `/main/dashboard`,
            icon: <HomeIcon />
        },
        {
            name: "Data Penyakit",
            href: `/main/disease`,
            icon: <SquareActivityIcon />
        },
        {
            name: "Data Obat",
            href: `/main/medicine`,
            icon: <PillIcon />
        },
        {
            name: "Laporan",
            href: `/main/report`,
            icon: <NewspaperIcon />
        },
        {
            name: "Pengguna",
            href: `/main/user`,
            icon: <Users2Icon />
        }
    ]
    return (
        <div>
            {/* Topbar */}
            <div className='bg-green-600 w-full h-10 flex justify-end items-center px-10'>
                {/* <button className='flex items-center gap-2'>
                   
                </button> */}
                <Menu>
                    <MenuButton className={'flex gap-2 items-center'}>
                        <p className='text-white'>Halo, {session?.name?.toUpperCase() || "Admin"}</p>
                        <ChevronDownCircle color='white' className='w-4' />
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
                            {/* <MenuItem>
                                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white text-black">
                                    <UserCircle className="size-4 text-black" />
                                    Ubah Profil
                                </button>
                            </MenuItem> */}
                            <MenuItem>
                                <button type='button' onClick={() => { deleteCookie("session"); router.push('/') }} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white text-red-500">
                                    <DoorOpenIcon className="size-4 text-red-500" />
                                    Logout
                                </button>
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>

            <div className='flex'>
                {/* Sidebar */}
                <div className='bg-green-600 w-1/6 h-[100vh] absolute z-10 top-0 left-0 pt-2'>
                    <div className='flex justify-center items-center gap-5'>
                        {/* <Image alt='logo' src={'/images/tokotitoh.png'} layout='relative' width={300} height={300} className='w-10 h-10' /> */}
                        <h2 className='text-white text-2xl text-center'>Aplikasi Sistem Pakar</h2>
                    </div>
                    <div className='flex flex-col mt-5'>
                        {
                            navs?.map((v: any) => (
                                <button
                                    key={v?.name}
                                    className={router.pathname.includes(v?.href) ? 'text-xl flex gap-2 bg-white p-2 text-blue-500 pl-10' : 'text-white text-xl flex gap-2 hover:bg-white p-2 hover:text-blue-500 duration-200 transition-all pl-10'}
                                    type='button'
                                    onClick={() => {
                                        router.push(v?.href)
                                    }}
                                >
                                    {v?.icon}
                                    {v?.name}
                                </button>
                            ))
                        }
                    </div>

                </div>
                <main className='container mt-5 ml-[280px] px-10 h-[90vh] w-full overflow-y-auto'>
                    {children}
                </main>
            </div>

        </div>
    )
}
