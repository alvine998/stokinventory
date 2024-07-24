import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { CONFIG } from '@/config'
import axios from 'axios'
import { PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'

export async function getServerSideProps(context: any) {
    try {
        const { page, limit, search } = context.query;
        const result = await axios.get(CONFIG.base_url_api + `/userapps/list?page=${+page || 1}&limit=${+limit || 10}&search=${search || ""}`)
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

export default function User({ table }: any) {
    const router = useRouter();
    const [filter, setFilter] = useState<any>(router.query)
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
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
            name: "Nama",
            sortable: true,
            selector: (row: any) => row?.name
        },
        {
            name: "Email",
            sortable: true,
            selector: (row: any) => row?.email || "-"
        },
        {
            name: "Nomor Telepon",
            sortable: true,
            selector: (row: any) => row?.phone
        },
        {
            name: "Jenis Kelamin",
            sortable: true,
            selector: (row: any) => row?.gender == "male" ? "Laki-laki" : "Perempuan"
        },
        {
            name: "Tanggal Lahir",
            sortable: true,
            selector: (row: any) => moment(row?.birth_date).format("DD-MM-YYYY")
        },
        {
            name: "Status",
            sortable: true,
            selector: (row: any) => row?.status == 1 ? 'Aktif' : 'Non Aktif'
        },
        {
            name: "Aksi",
            right: true,
            selector: (row: any) => <div className='flex gap-2'>
                {/* <Button title='Edit' color='primary' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                }}>
                    <PencilIcon className='text-white w-5 h-5' />
                </Button> */}
                <Button title='Hapus' color='danger' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "delete" })
                }}>
                    <TrashIcon className='text-white w-5 h-5' />
                </Button>
            </div>
        },
    ]

    const onSubmit = async (e: any) => {
        e?.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target))
        try {
            const payload = {
                ...formData
            }
            if (formData?.id) {
                const result = await axios.patch(CONFIG.base_url_api + `/users/update/${payload?.id}`, payload)
            } else {
                const result = await axios.post(CONFIG.base_url_api + `/users/register`, payload)
            }
            Swal.fire({
                icon: "success",
                text: "Data Berhasil Disimpan"
            })
            setModal({ ...modal, open: false })
            router.push('')
        } catch (error) {
            console.log(error);
        }
    }
    const onRemove = async (e: any) => {
        try {
            e?.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target))
            const result = await axios.delete(CONFIG.base_url_api + `/users/delete/${formData?.id}`)
            Swal.fire({
                icon: "success",
                text: "Data Berhasil Dihapus"
            })
            setModal({ ...modal, open: false })
            router.push('')
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Pengguna Aplikasi</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' defaultValue={filter?.search} onChange={(e) => {
                            setFilter({ ...filter, search: e.target.value })
                        }} />
                    </div>
                    <div className='lg:w-auto w-full'>
                        {/* <Button type='button' color='info' className={'flex gap-2 px-2 items-center lg:justify-start justify-center'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                        }}>
                            <PlusIcon className='w-4' />
                            Akses Admin
                        </Button> */}
                    </div>
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
                {
                    modal?.key == "delete" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>Hapus Pengguna Aplikasi</h2>
                        <form onSubmit={onRemove}>
                            <input type="hidden" name="id" value={modal?.data?.id} />
                            <p className='text-center my-2'>Apakah anda yakin ingin menghapus data {modal?.data?.name}?</p>
                            <div className='flex gap-2 lg:flex-row flex-col-reverse justify-end'>
                                <div>
                                    <Button color='white' type='button' onClick={() => {
                                        setModal({ open: false })
                                    }}>
                                        Kembali
                                    </Button>
                                </div>

                                <div>
                                    <Button color='danger' className={'flex gap-2 px-2 items-center justify-center'}>
                                        <Trash2Icon className='w-4 h-4' />
                                        Hapus
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </Modal>
                        : ""
                }
            </div>
        </div>
    )
}
