import ApexChart from '@/components/Chart'
import { CONFIG } from '@/config';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React from 'react'

export async function getServerSideProps(context: any) {
    try {
        const { page, limit } = context.query;
        // const { req, res } = context;
        // const session = getCookie("session", { req, res })
        // console.log(session);
        const [user_apps, diseases, medicines, symptoms, dataset_diseases] = await Promise.all([
            axios.get(CONFIG.base_url_api + `/userapps/list`),
            axios.get(CONFIG.base_url_api + `/diseases/list`),
            axios.get(CONFIG.base_url_api + `/medicines/list`),
            axios.get(CONFIG.base_url_api + `/symptoms/list`),
            axios.get(CONFIG.base_url_api + `/datasets/list`),
        ])
        console.log(user_apps?.data);
        return {
            props: {
                user_apps: user_apps?.data?.total_items || 0,
                diseases: diseases?.data?.total_items || 0,
                medicines: medicines?.data?.total_items || 0,
                symptoms: symptoms?.data?.total_items || 0,
                dataset_diseases: dataset_diseases?.data?.total_items || 0
            }
        }
    } catch (error) {
        console.log(error);
        return {
            props: {

            }
        }
    }
}

export default function Dashboard({ user_apps, diseases, medicines, symptoms, dataset_diseases }: any) {
    return (
        <div>

            <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                <p className='text-white text-xl lg:text-left text-center'>Welcome Home Admin</p>
            </div>

            <div className='flex lg:flex-row flex-col gap-2 justify-between items-center mt-5'>
                <div className='bg-green-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Produk :</h5>
                    <p className='text-white text-xl'>{user_apps || 0}</p>
                </div>

                <div className='bg-orange-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Toko :</h5>
                    <p className='text-white text-xl'>{diseases || 0}</p>
                </div>

                <div className='bg-blue-500 w-full h-auto p-2 rounded'>
                    <h5 className='text-white font-semibold text-xl'>Admin :</h5>
                    <p className='text-white text-xl'>{medicines || 0}</p>
                </div>
            </div>

            <div className='mt-5'>
                <h2 className='text-xl'>Grafik Pertumbuhan Stock Opname</h2>
                <ApexChart />
            </div>
        </div>
    )
}
