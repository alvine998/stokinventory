import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  ClipboardList,
  MinusIcon,
  MinusSquare,
  PencilIcon,
  PlusIcon,
  PlusSquare,
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
    const { page, size, search } = context.query;
    const { req, res } = context;
    let session: any = getCookie("session", { req, res });
    if (session) {
      session = JSON.parse(session);
    }
    const result = await axios.get(
      CONFIG.base_url_api +
        `/products?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    return {
      props: {
        table: result?.data || [],
        session,
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

export default function Medicine({ table, session }: any) {
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
  const Columns: any = [
    {
      name: "Nama Produk",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "Kode",
      sortable: true,
      selector: (row: any) => row?.code || "-",
    },
    {
      name: "Stok",
      sortable: true,
      selector: (row: any) => `${row?.stock || "0"} ${row?.unit}`,
    },
    {
      name: "Harga Modal",
      sortable: true,
      selector: (row: any) => toMoney(row?.price) || "0",
    },
    session?.role !== "admin_store" && {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2">
          {/* <Button
            title="Kurang"
            color="danger"
            onClick={() => {
              setModal({ ...modal, open: true, data: row, key: "update" });
            }}
          >
            <MinusIcon className="text-white w-5 h-5" />
          </Button> */}
          <Button
            title="Tambah"
            color="primary"
            onClick={() => {
              setModal({ ...modal, open: true, data: row, key: "delete" });
            }}
          >
            <PlusIcon className="text-white w-5 h-5" />
          </Button>
        </div>
      ),
    },
  ]?.filter((v: any) => v !== false);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData: any = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        ...formData,
        price: formData?.price?.replaceAll(".", ""),
      };
      if (formData?.id) {
        const result = await axios.patch(
          CONFIG.base_url_api + `/product`,
          payload,
          {
            headers: {
              "bearer-token": "stokinventoryapi",
              "x-partner-code": session?.partner_code,
            },
          }
        );
      } else {
        const result = await axios.post(
          CONFIG.base_url_api + `/product`,
          payload,
          {
            headers: {
              "bearer-token": "stokinventoryapi",
              "x-partner-code": session?.partner_code,
            },
          }
        );
      }
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Disimpan",
      });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const onRemove = async (e: any) => {
    try {
      e?.preventDefault();
      setLoading(true);
      const formData = Object.fromEntries(new FormData(e.target));
      const result = await axios.delete(
        CONFIG.base_url_api + `/product?id=${formData?.id}`,
        {
          headers: {
            "bearer-token": "stokinventoryapi",
            "x-partner-code": session?.partner_code,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Dihapus",
      });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold">Transaksi</h2>

      <div className="mt-5">
        <div className="w-full flex gap-4">
          <div className="w-full">
            <Input
              label=""
              type="search"
              placeholder="Cari disini..."
              defaultValue={filter?.search}
              onChange={(e: any) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
            <div className="mt-5">
              {show && (
                <DataTable
                  pagination
                  onChangePage={(pageData) => {
                    setFilter({ ...filter, page: pageData });
                  }}
                  onChangeRowsPerPage={(currentRow, currentPage) => {
                    setFilter({
                      ...filter,
                      page: currentPage,
                      size: currentRow,
                    });
                  }}
                  responsive={true}
                  paginationTotalRows={table?.total_items}
                  paginationDefaultPage={1}
                  paginationServer={true}
                  striped
                  columns={Columns}
                  data={table?.items}
                  customStyles={CustomTableStyle}
                />
              )}
            </div>
          </div>
          <div className="w-1/4 bg-gray-100 h-[70vh] rounded p-2">
              <h2 className="font-semibold font-sans">{table?.items[0]?.name}</h2>
          </div>
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
                isCurrency
                label="Harga Modal"
                placeholder="Masukkan Harga Modal"
                name="price"
                defaultValue={modal?.data?.price || ""}
                required
              />
              <Input
                label="Min Order"
                placeholder="Masukkan Min Order"
                name="moq"
                defaultValue={modal?.data?.moq || ""}
                type="number"
              />
              <Input
                label="Satuan"
                placeholder="Kg/Pcs/Ons/dll"
                name="unit"
                defaultValue={modal?.data?.unit || ""}
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
                    disabled={loading}
                  >
                    <SaveAllIcon className="w-4 h-4" />
                    {loading ? "Menyimpan..." : "Simpan"}
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
              Hapus Data Produk
            </h2>
            <form onSubmit={onRemove}>
              <input type="hidden" name="id" value={modal?.data?.id} />
              <p className="text-center my-2">
                Apakah anda yakin ingin menghapus produk {modal?.data?.name}?
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
                    disabled={loading}
                  >
                    <Trash2Icon className="w-4 h-4" />
                    {loading ? "Menghapus..." : "Hapus"}
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
