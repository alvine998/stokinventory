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
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
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
        `/stores?page=${+page || 1}&size=${+size || 10}&search=${search || ""}`,
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
  const CustomerColumn: any = [
    {
      name: "Stock Out",
      sortable: true,
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => {
            setModal({
              ...modal,
              open: true,
              key: "view",
              data: row?.stocks,
            });
          }}
          className="text-blue-500"
        >
          Lihat
        </button>
      ),
    },
    {
      name: "Tanggal Berangkat",
      sortable: true,
      selector: (row: any) => row?.deliver_at || "-",
    },
    {
      name: "Tanggal Diterima",
      sortable: true,
      selector: (row: any) => row?.arrived_at || "-",
    },
    {
      name: "Diantar Oleh",
      sortable: true,
      selector: (row: any) => row?.delivered_by?.name || "-",
    },
    {
      name: "Bukti",
      sortable: true,
      selector: (row: any) => row?.image ? <Image alt="bukti" src={row?.image} width={50} height={50} />  : "-",
    },
    {
      name: "Status",
      sortable: true,
      selector: (row: any) => row?.status == 0 ? "Menunggu" : row?.status == 1 ? "Dalam Perjalanan" : row?.status == 2 ? "Sampai Tujuan" : "Pending",
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
          CONFIG.base_url_api + `/store`,
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
          CONFIG.base_url_api + `/store`,
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
        CONFIG.base_url_api + `/store?id=${formData?.id}`,
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
      <h2 className="text-2xl font-semibold">Delivery</h2>

      <div className="mt-5">
        <div className="flex lg:flex-row flex-col justify-between items-center">
          <div className="lg:w-auto w-full">
            <Input
              label=""
              type="search"
              placeholder="Cari disini..."
              defaultValue={filter?.search}
              onChange={(e: any) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
          <div className="lg:w-auto w-full flex gap-2">
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
                Delivery
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
                setFilter({ ...filter, page: currentPage, size: currentRow });
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
              {modal.key == "create" ? "Tambah" : "Ubah"} Delivery
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
                label="Nama Toko"
                placeholder="Masukkan Nama Toko"
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
                label="Alamat"
                placeholder="Masukkan Alamat"
                name="address"
                defaultValue={modal?.data?.address || ""}
                required
              />
              <Input
                label="Latitude"
                placeholder="Masukkan Latitude"
                name="lat"
                defaultValue={modal?.data?.lat || ""}
                isOptional
              />
              <Input
                label="Longitude"
                placeholder="Masukkan Longitude"
                name="long"
                defaultValue={modal?.data?.long || ""}
                isOptional
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
              Hapus Delivery
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
