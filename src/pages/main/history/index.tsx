import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { CONFIG } from '@/config'
import axios from 'axios'
import { PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'

export async function getServerSideProps(context: any) {
    try {
        const { page, limit, search } = context.query;
        const result = await axios.get(CONFIG.base_url_api + `/diagnose/list?page=${+page || 1}&limit=${+limit || 10}&search=${search || ""}`)
        return {
            props: {
                table: result?.data || []
            }
        }
    } catch (error: any) {
        console.log(error);
        return {
            props: {
                error: "Error internal server",
            }
        }
    }
}

export default function Medicine({ table }: any) {
    const router = useRouter();
    const [filter, setFilter] = useState<any>(router.query)
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    const [selected, setSelected] = useState<any>()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    useEffect(() => {
        const queryFilter = new URLSearchParams(filter).toString();
        router.push(`?${queryFilter}`)
    }, [filter])
    const CustomerColumn: any = [
        {
            name: "Tanggal",
            sortable: true,
            width:"300px",
            selector: (row: any) => row?.created_on
        },
        {
            name: "Nama Pengguna",
            sortable: true,
            selector: (row: any) => row?.user_app_name
        },
        {
            name: "Gejala",
            sortable: true,
            selector: (row: any) => row?.symptoms
        },
        {
            name: "Periode (Hari)",
            sortable: true,
            selector: (row: any) => row?.period + " Hari"
        },
        {
            name: "Tingkatan",
            sortable: true,
            selector: (row: any) => row?.level == 1 ? 'Tidak Gawat Darurat' : row?.level == 2 ? 'Gawat Darurat' : 'Sangat Gawat Darurat'
        },
        {
            name: "Diagnosa Penyakit",
            sortable: true,
            selector: (row: any) => row?.disease_diagnose
        },
        {
            name: "Akurasi Penyakit",
            sortable: true,
            selector: (row: any) => row?.disease_accuracy_score * 100 + " %"
        },
        {
            name: "Skor Prediksi Penyakit",
            sortable: true,
            selector: (row: any) => row?.disease_precision_score * 100 + " %"
        },
        {
            name: "Skor Recall Penyakit",
            sortable: true,
            selector: (row: any) => row?.disease_recall_score * 100 + " %"
        },
        {
            name: "Skor F1 Penyakit",
            sortable: true,
            selector: (row: any) => row?.disease_f1_score * 100 + " %"
        },
        {
            name: "Akurasi Obat",
            sortable: true,
            selector: (row: any) => row?.medicine_accuracy_score * 100 + " %"
        },
        {
            name: "Rekomendasi Obat",
            sortable: true,
            selector: (row: any) => row?.medicine_recommendation || "-"
        },
        {
            name: "Aksi",
            right: true,
            selector: (row: any) => <div className='flex gap-2'>
                <Button title='Edit' color='primary' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                }}>
                    <PencilIcon className='text-white w-5 h-5' />
                </Button>
                <Button title='Hapus' color='danger' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "delete" })
                }}>
                    <TrashIcon className='text-white w-5 h-5' />
                </Button>
            </div>
        },
    ]

    const levels = [
        { value: "", label: "Pilih Tingkat Kesakitan" },
        { value: 1, label: "Tidak Gawat Darurat" },
        { value: 2, label: "Gawat Darurat" },
        { value: 3, label: "Sangat Gawat Darurat" }
    ]

    return (
        <div>
            <h2 className='text-2xl font-semibold'>Riwayat Diagnosa</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' defaultValue={filter?.search} onChange={(e: any) => {
                            setFilter({ ...filter, search: e.target.value })
                        }} />
                    </div>
                    {/* <div className='lg:w-auto w-full'>
                        <Button type='button' color='info' className={'flex gap-2 px-2 items-center lg:justify-start justify-center'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                        }}>
                            <PlusIcon className='w-4' />
                            Diagnosa Penyakit
                        </Button>
                    </div> */}
                </div>
                <div className='mt-5'>
                    {
                        show &&
                        <DataTable
                            pagination
                            onChangePage={(pageData) => {
                                setFilter({ ...filter, page: pageData })
                            }}
                            onChangeRowsPerPage={(currentRow, currentPage) => {
                                setFilter({ ...filter, page: currentPage, limit: currentRow })
                            }}
                            responsive={true}
                            paginationTotalRows={table?.total_items}
                            paginationDefaultPage={1}
                            paginationServer={true}
                            striped
                            columns={CustomerColumn}
                            data={table?.items}
                            customStyles={CustomTableStyle}
                        />
                    }
                </div>
            </div>
        </div>
    )
}
