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
        const result = await axios.get(CONFIG.base_url_api + `/datasets/list?page=${+page || 1}&limit=${+limit || 10}&search=${search || ""}`)
        const diseases = await axios.get(CONFIG.base_url_api + `/diseases/list?limit=999999`)
        const medicines = await axios.get(CONFIG.base_url_api + `/medicines/list?limit=999999`)
        const symptoms = await axios.get(CONFIG.base_url_api + `/symptoms/list?limit=999999`)
        console.log(result.data);
        return {
            props: {
                table: result?.data || [],
                diseases: diseases?.data?.items || [],
                symptoms: symptoms?.data?.items || [],
                medicines: medicines?.data?.items || []
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

export default function Medicine({ table, diseases, symptoms, medicines }: any) {
    const router = useRouter();
    const [filter, setFilter] = useState<any>(router.query)
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useState<useModal>()
    const [selected, setSelected] = useState<any>()
    const SYMPTOMS: any[] = [...symptoms?.map((v: any) => ({ ...v, value: v?.id, label: v?.name?.toUpperCase() }))]
    const DISEASES: any[] = [{ value: "", label: "Pilih Penyakit" }, ...diseases?.map((v: any) => ({ ...v, value: v?.id, label: v?.name }))]
    const MEDICINES: any[] = [{ value: "", label: "Pilih Rekomendasi Obat" }, ...medicines?.map((v: any) => ({ ...v, value: v?.id, label: v?.name }))]
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
            name: "Gejala",
            sortable: true,
            selector: (row: any) => row?.symptoms
        },
        {
            name: "Lama Sakit",
            sortable: true,
            selector: (row: any) => row?.period + " Hari"
        },
        {
            name: "Tingkat Kesakitan",
            sortable: true,
            selector: (row: any) => levels?.find((v:any) => v?.value == row?.level)?.label
        },
        {
            name: "Diagnosa",
            sortable: true,
            selector: (row: any) => row?.diagnose
        },
        {
            name: "Rekomendasi Obat",
            sortable: true,
            selector: (row: any) => row?.medicine
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

    const onSubmit = async (e: any) => {
        e?.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target))
        try {
            const payload = {
                ...formData,
                period: +formData?.period,
                level: +formData?.level,
                symptoms: selected?.symptoms?.map((v: any) => v?.name?.toUpperCase())?.join(" | "),
                diagnose: selected?.diagnose?.name,
                medicine: selected?.medicine?.name,
            }
            if (formData?.id) {
                const result = await axios.patch(CONFIG.base_url_api + `/datasets/update/${formData?.id}`, payload)
            } else {
                const result = await axios.post(CONFIG.base_url_api + `/datasets/create`, payload)
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
            const result = await axios.delete(CONFIG.base_url_api + `/datasets/delete/${formData?.id}`)
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
            <h2 className='text-2xl font-semibold'>Dataset</h2>

            <div className='mt-5'>
                <div className='flex lg:flex-row flex-col justify-between items-center'>
                    <div className='lg:w-auto w-full'>
                        <Input label='' type='search' placeholder='Cari disini...' defaultValue={filter?.search} onChange={(e) => {
                            setFilter({ ...filter, search: e.target.value })
                        }} />
                    </div>
                    <div className='lg:w-auto w-full'>
                        <Button type='button' color='info' className={'flex gap-2 px-2 items-center lg:justify-start justify-center'} onClick={() => {
                            setModal({ ...modal, open: true, data: null, key: "create" })
                        }}>
                            <PlusIcon className='w-4' />
                            Dataset
                        </Button>
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
                    modal?.key == "create" || modal?.key == "update" ? <Modal open={modal.open} setOpen={() => setModal({ ...modal, open: false })}>
                        <h2 className='text-xl font-semibold text-center'>{modal.key == 'create' ? "Tambah" : "Ubah"} Dataset Penyakit</h2>
                        <form onSubmit={onSubmit}>
                            {
                                modal.key == "update" &&
                                <input type="hidden" name="id" value={modal?.data?.id || null} />
                            }
                            <div className='mt-2'>
                                <label htmlFor="symptoms" className='text-gray-500'>Gejala</label>
                                <ReactSelect
                                    options={SYMPTOMS}
                                    id='symptoms'
                                    name='symptoms'
                                    maxMenuHeight={150}
                                    defaultValue={
                                        modal?.data?.symptoms ?
                                            SYMPTOMS?.filter((v: any) => modal?.data?.symptoms?.split(" | ")?.includes(v?.name?.toUpperCase()))
                                            : ""
                                    }
                                    placeholder="Pilih Gejala"
                                    isMulti
                                    onChange={(e) => {
                                        setSelected({ ...selected, symptoms: e })
                                    }}
                                />
                            </div>
                            <Input label='Lama Sakit (Hari)' placeholder='Masukkan Lama Sakit' type='number' name='period' defaultValue={modal?.data?.period || ""} required />
                            <div className='mt-2'>
                                <label htmlFor="level" className='text-gray-500'>Tingkat Kesakitan</label>
                                <ReactSelect
                                    options={levels}
                                    id='level'
                                    name='level'
                                    maxMenuHeight={100}
                                    defaultValue={
                                        modal?.data?.level ?
                                            { value: modal?.data?.level, label: levels?.find((v: any) => v?.value == modal?.data?.level)?.label }
                                            : levels[0]
                                    }
                                />
                            </div>
                            <div className='mt-2 relative'>
                                <label htmlFor="disease_id" className='text-gray-500'>Diagnosa</label>
                                <ReactSelect
                                    options={DISEASES}
                                    id='disease_id'
                                    name='disease_id'
                                    maxMenuHeight={150}
                                    onChange={(e) => {
                                        setSelected({ ...selected, diagnose: e })
                                    }}
                                    defaultValue={
                                        modal?.data?.disease_id ?
                                            { value: modal?.data?.disease_id, label: modal?.data?.diagnose }
                                            : DISEASES?.[0]
                                    }
                                    required
                                    menuPlacement='top'
                                />
                            </div>
                            <div className='mt-2 relative'>
                                <label htmlFor="medicine_id" className='text-gray-500'>Rekomendasi Obat</label>
                                <ReactSelect
                                    options={MEDICINES}
                                    id='medicine_id'
                                    name='medicine_id'
                                    maxMenuHeight={150}
                                    onChange={(e) => {
                                        setSelected({ ...selected, medicine: e })
                                    }}
                                    required
                                    defaultValue={
                                        modal?.data?.medicine_id ?
                                            { value: modal?.data?.medicine_id, label: modal?.data?.medicine }
                                            : MEDICINES?.[0]
                                    }
                                    menuPlacement='top'
                                />
                            </div>
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
                        <h2 className='text-xl font-semibold text-center'>Hapus Dataset Penyakit</h2>
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
