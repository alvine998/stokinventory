import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal, { useModal } from '@/components/Modal'
import { CustomTableStyle } from '@/components/table/CustomTableStyle'
import { PencilIcon, PlusIcon, SaveAllIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const data: any = [
    {
        name: "alfa",
        phone: "089975756474",
        email: "alfa@gmail.com",
        role: "super_admin",
        status: "1"
    }
]

export default function User() {
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShow(true)
        }
    }, [])
    const CustomerColumn: any = [
        {
            name: "Nama",
            sortable: true,
            selector: (row: any) => row?.name
        },
        {
            name: "No Telepon",
            selector: (row: any) => row?.phone
        },
        {
            name: "Email",
            sortable: true,
            selector: (row: any) => row?.email || "-"
        },
        {
            name: "Peran",
            sortable: true,
            selector: (row: any) => row?.role == 'super_admin' ? "SUPER ADMIN" : "ADMIN"
        },
        {
            name: "Status",
            sortable: true,
            selector: (row: any) => row?.status == '1' ? 'Aktif' : 'Non Aktif'
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
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Akses Admin</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' />
                    </div>
                    <div className='lg:w-auto w-full'>
                        <Button type='button' color='info' className={'flex gap-2 px-2 items-center lg:justify-start justify-center'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                        }}>
                            <PlusIcon className='w-4' />
                            Akses Admin
                        </Button>
                    </div>
                </div>
                <div className='mt-5'>
                    {
                        show &&
                        <DataTable
                            columns={CustomerColumn}
                            data={data}
                            selectableRows
                            customStyles={CustomTableStyle}
                        />
                    }
                </div>
                {
                    modal?.key == "create" || modal?.key == "update" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Akses Admin</h2>
                        <form>
                            <input type="hidden" name="id" value={modal?.data?.id} />
                            <Input label='Nama' placeholder='Masukkan Nama' name='name' defaultValue={modal?.data?.name || ""} required />
                            <Input label='No Telepon' placeholder='Masukkan No Telepon' name='phone' type='number' defaultValue={modal?.data?.phone || ""} required />
                            <Input label='Email' placeholder='Masukkan Email' name='email' type='email' defaultValue={modal?.data?.email || ""} />
                            <Input label='Password' placeholder='Masukkan Password' name='password' type='password' defaultValue={""} required={modal.key == 'create'} />
                            <div className='w-full my-2'>
                                <label className='text-gray-500' htmlFor="x">Peran</label>
                                <div className='flex gap-5'>
                                    <div className='flex gap-2'>
                                        <input type='radio' name='role' value={'super_admin'} defaultChecked={modal?.data?.role == 'super_admin'} />
                                        <span>Super Admin</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <input type='radio' name='role' value={'admin'} defaultChecked={modal?.data?.role == 'admin'} />
                                        <span>Admin</span>
                                    </div>
                                </div>
                            </div>
                            {
                                modal.key == 'update' ?
                                    <div>
                                        <div className='w-full my-2'>
                                            <label className='text-gray-500' htmlFor="x">Status</label>
                                            <div className='flex gap-5'>
                                                <div className='flex gap-2'>
                                                    <input type='radio' name='status' value={'1'} defaultChecked={modal?.data?.status == 1} />
                                                    <span>Aktif</span>
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input type='radio' name='status' value={'2'} defaultChecked={modal?.data?.status == 0} />
                                                    <span>Non Aktif</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : ""
                            }
                            <div className='flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end'>
                                <div>
                                    <Button color='white' type='button' onClick={() => {
                                        setModal({ open: false })
                                    }}>
                                        Kembali
                                    </Button>
                                </div>

                                <div>
                                    <Button color='info' className={'flex gap-2 px-2 items-center justify-center'}>
                                        <SaveAllIcon className='w-4 h-4' />
                                        Simpan
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </Modal>
                        : ""
                }
                {
                    modal?.key == "delete" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>Hapus Akses Admin</h2>
                        <form>
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