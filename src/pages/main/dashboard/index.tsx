import ApexChart from '@/components/Chart'
import React from 'react'

export default function Dashboard() {
    return (
        <div>

            <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                <p className='text-white text-xl lg:text-left text-center'>Selamat Datang Admin</p>
            </div>

            <div className='flex lg:flex-row flex-col gap-2 justify-between items-center mt-5'>
                <div className='bg-green-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Pengguna :</h5>
                    <p className='text-white text-xl'>50</p>
                </div>

                <div className='bg-orange-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Iklan :</h5>
                    <p className='text-white text-xl'>5</p>
                </div>

                <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Laporan :</h5>
                    <p className='text-white text-xl'>25</p>
                </div>

                <div className='bg-red-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Total Kategori :</h5>
                    <p className='text-white text-xl'>125</p>
                </div>
            </div>

            <div className='mt-5'>
                <h2 className='text-xl'>Perkembangan Pengguna</h2>
                <ApexChart />
            </div>

            <div className='mt-5'>
                <h2 className='text-xl'>Perkembangan Iklan</h2>
                <ApexChart />
            </div>
        </div>
    )
}
