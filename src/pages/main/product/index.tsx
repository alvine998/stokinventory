import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import axios from "axios";
import {
  ClipboardList,
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { page, limit, search } = context.query;
    const result = await axios.get(
      CONFIG.base_url_api +
        `/medicines/list?page=${+page || 1}&limit=${+limit || 10}&search=${
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
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);
  const CustomerColumn: any = [
    {
      name: "Nama Produk",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "Kode",
      sortable: true,
      selector: (row: any) => row?.dose || "-",
    },
    {
      name: "Stok",
      sortable: true,
      selector: (row: any) => row?.stock || "0",
    },
    {
      name: "Harga Modal",
      sortable: true,
      selector: (row: any) => row?.capital_price || "0",
    },
    {
      name: "Min Order",
      sortable: true,
      selector: (row: any) => row?.moq || "0",
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
      if (formData?.id) {
        const result = await axios.patch(
          CONFIG.base_url_api + `/medicines/update/${formData?.id}`,
          payload
        );
      } else {
        const result = await axios.post(
          CONFIG.base_url_api + `/medicines/create`,
          payload
        );
      }
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Disimpan",
      });
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error) {
      console.log(error);
    }
  };
  const onRemove = async (e: any) => {
    try {
      e?.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      const result = await axios.delete(
        CONFIG.base_url_api + `/medicines/delete/${formData?.id}`
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
      <h2 className="text-2xl font-semibold">Data Produk</h2>

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
          <div className="lg:w-auto w-full flex gap-2">
            <div className="w-auto">
              <Button
                type="button"
                color="primary"
                className={
                  "flex gap-2 px-2 items-center lg:justify-start justify-center"
                }
                onClick={() => {
                  router.push(`/main/product/selling-price`)
                }}
              >
                <ClipboardList className="w-4" />
                Perkiraan Harga Jual
              </Button>
            </div>
            <div className="w-auto">
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
                Data Produk
              </Button>
            </div>
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
              columns={CustomerColumn}
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
              {modal.key == "create" ? "Tambah" : "Ubah"} Data Produk
            </h2>
            <form onSubmit={onSubmit}>
              {modal.key == "update" && (
                <input
                  type="hidden"
                  name="id"
                  value={modal?.data?.id || null}
                />
              )}
              <Input
                label="Nama"
                placeholder="Masukkan Nama"
                name="name"
                defaultValue={modal?.data?.name || ""}
                required
              />
              <Input
                label="Kode"
                placeholder="Masukkan Kode"
                name="code"
                defaultValue={modal?.data?.code || ""}
                required
              />
              <Input
                label="Stok"
                placeholder="Masukkan Stok"
                name="stock"
                defaultValue={modal?.data?.stock || ""}
                type="number"
                required
              />
              <Input
                isCurrency
                label="Harga Modal"
                placeholder="Masukkan Harga Modal"
                name="capital_price"
                defaultValue={modal?.data?.capital_price || ""}
                required
              />
              <Input
                label="Min Order"
                placeholder="Masukkan Min Order"
                name="moq"
                defaultValue={modal?.data?.moq || ""}
                type="number"
                required
              />
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
              Hapus Data Obat
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