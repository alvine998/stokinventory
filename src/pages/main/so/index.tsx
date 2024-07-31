import Button from "@/components/Button";
import FileUpload from "@/components/FileUpload";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import Radio from "@/components/Radio";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import axios from "axios";
import {
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
  UploadCloudIcon,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { page, limit, search } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/diseases/list?page=${+page || 1}&limit=${+limit || 10}&search=${
          search || ""
        }`
    );
    return {
      props: {
        table: result?.data || [],
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      props: {
        error: "Error internal server",
      },
    };
  }
}

export default function Medicine({ table }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [image, setImage] = useState<any>({
    data:"",
    preview: ""
  })
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);
  const Column: any = [
    {
      name: "Waktu",
      sortable: true,
      selector: (row: any) => row?.date,
    },
    {
      name: "Jenis Stok",
      sortable: true,
      selector: (row: any) => row?.type == "in" ? "Barang Masuk" : "Barang Keluar",
    },
    {
      name: "Bukti",
      sortable: true,
      selector: (row: any) => <a href={row?.image} className="text-blue-500" >Lihat</a>,
    },
    {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2">
          <Button
            title="Edit"
            color="primary"
            onClick={() => {
              setModal({ ...modal, open: true, data: row, key: "update" });
            }}
          >
            <PencilIcon className="text-white w-5 h-5" />
          </Button>
          <Button
            title="Hapus"
            color="danger"
            onClick={() => {
              setModal({ ...modal, open: true, data: row, key: "delete" });
            }}
          >
            <TrashIcon className="text-white w-5 h-5" />
          </Button>
        </div>
      ),
    },
  ];

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        ...formData,
      };
      let result: any = null;
      if (formData?.id) {
        result = await axios.patch(
          CONFIG.base_url_api + `/diseases/update/${formData?.id}`,
          payload
        );
      } else {
        result = await axios.post(
          CONFIG.base_url_api + `/diseases/create`,
          payload
        );
      }
      if (result.data[1] == 400) {
        Swal.fire({
          icon: "warning",
          text: "Data Sudah Tersedia",
        });
      } else {
        Swal.fire({
          icon: "success",
          text: "Data Berhasil Disimpan",
        });
      }
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        text: error?.message || "Error",
      });
    }
  };
  const onRemove = async (e: any) => {
    try {
      e?.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      const result = await axios.delete(
        CONFIG.base_url_api + `/diseases/delete/${formData?.id}`
      );
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Dihapus",
      });
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold">Stock Opname (SO)</h2>

      <div className="mt-5">
        <div className="flex lg:flex-row flex-col justify-between items-center">
          <div className="lg:w-auto w-full">
            <Input
              label=""
              type="search"
              placeholder="Cari disini..."
              defaultValue={filter?.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
          <div className="lg:w-auto w-full">
            <Button
              type="button"
              color="info"
              className={
                "flex gap-2 px-2 items-center lg:justify-start justify-center"
              }
              onClick={() => {
                setModal({ ...modal, open: true, data: null, key: "create" });
              }}
            >
              <PlusIcon className="w-4" />
              Input Stok
            </Button>
          </div>
        </div>
        <div className="mt-5">
          {show && (
            <DataTable
              pagination
              onChangePage={(pageData) => {
                setFilter({ ...filter, page: pageData });
              }}
              onChangeRowsPerPage={(currentRow, currentPage) => {
                setFilter({ ...filter, page: currentPage, limit: currentRow });
              }}
              responsive={true}
              paginationTotalRows={table?.total_items}
              paginationDefaultPage={1}
              paginationServer={true}
              striped
              columns={Column}
              data={table?.items}
              customStyles={CustomTableStyle}
            />
          )}
        </div>
        {modal?.key == "create" || modal?.key == "update" ? (
          <Modal
            open={modal.open}
            setOpen={() => setModal({ ...modal, open: false })}
          >
            <h2 className="text-xl font-semibold text-center">
              {modal.key == "create" ? "Tambah" : "Ubah"} Input Stok
            </h2>
            <form onSubmit={onSubmit}>
              {modal.key == "update" && (
                <input
                  type="hidden"
                  name="id"
                  value={modal?.data?.id || null}
                />
              )}
              <Radio
                id="radio1"
                name="type"
                options={[
                  {
                    name: "Barang Masuk",
                    value: "in",
                    checked: modal?.data?.type == "in" || true
                  },
                  {
                    name: "Barang Keluar",
                    value: "out",
                    checked: modal?.data?.type == "out"
                  },
                ]}
                label="Jenis Stok"
              />
              <Input
                label="Waktu"
                name="date"
                defaultValue={
                  modal?.data?.date || moment().format("YYYY-MM-DD HH:mm")
                }
                type="datetime-local"
                required
              />
              <FileUpload image={image} label="Bukti" onChange={(e: any)=>{
                const file = e.target.files
                if(file){
                  console.log(file);
                  setImage({data: file[0], preview: URL.createObjectURL(file[0])})
                }
              }} name="image" defaultValue={image?.data || ""} />
              <div className="flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end">
                <div>
                  <Button
                    color="white"
                    type="button"
                    onClick={() => {
                      setModal({ open: false });
                    }}
                  >
                    Kembali
                  </Button>
                </div>

                <div>
                  <Button
                    color="info"
                    className={"flex gap-2 px-2 items-center justify-center"}
                  >
                    <SaveAllIcon className="w-4 h-4" />
                    Simpan
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
        ) : (
          ""
        )}
        {modal?.key == "delete" ? (
          <Modal
            open={modal.open}
            setOpen={() => setModal({ ...modal, open: false })}
          >
            <h2 className="text-xl font-semibold text-center">
              Hapus Data Penyakit
            </h2>
            <form onSubmit={onRemove}>
              <input type="hidden" name="id" value={modal?.data?.id} />
              <p className="text-center my-2">
                Apakah anda yakin ingin menghapus data {modal?.data?.name}?
              </p>
              <div className="flex gap-2 lg:flex-row flex-col-reverse justify-end">
                <div>
                  <Button
                    color="white"
                    type="button"
                    onClick={() => {
                      setModal({ open: false });
                    }}
                  >
                    Kembali
                  </Button>
                </div>

                <div>
                  <Button
                    color="danger"
                    className={"flex gap-2 px-2 items-center justify-center"}
                  >
                    <Trash2Icon className="w-4 h-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
