import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import TextArea from "@/components/TextArea";
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
  XCircleIcon,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ReactSelect from "react-select";
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
        `/recipes?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const products = await axios.get(CONFIG.base_url_api + `/products`, {
      headers: {
        "bearer-token": "stokinventoryapi",
        "x-partner-code": session?.partner_code,
      },
    });
    return {
      props: {
        table: result?.data || [],
        products: products.data?.items || [],
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

export default function Medicine({ table, session, products }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [list, setList] = useState<any>({ product: [] });
  const [product, setProduct] = useState<any>(products);
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
      name: "Nama Menu",
      sortable: true,
      selector: (row: any) => row?.name || "-",
    },
    {
      name: "Bahan-bahan",
      sortable: true,
      selector: (row: any) => (
        <button
          className="text-center text-blue-500"
          type="button"
          onClick={() => {
            setModal({ ...modal, open: true, key: "view", data: row });
          }}
        >
          Lihat
        </button>
      ),
    },
    {
      name: "Harga Modal",
      sortable: true,
      selector: (row: any) => toMoney(row?.price) || "0",
    },
    {
      name: "Keterangan",
      sortable: true,
      selector: (row: any) => row?.remarks || "-",
    },
    {
      name: "Status",
      sortable: true,
      selector: (row: any) =>
        row?.status == 1 ? (
          <p className="text-center text-green-500">Available</p>
        ) : (
          <p className="text-center text-red-500">Not Available</p>
        ),
    },
    session?.role !== "admin_store" && {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2">
          <Button
            title="Edit"
            color="primary"
            onClick={() => {
              setList({ product: JSON.parse(row?.products) });
              setProduct(
                product?.filter(
                  (val: any) =>
                    !list?.product?.map((v: any) => v?.id)?.includes(val?.id)
                )
              );
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
        products: list?.product,
      };
      if (formData?.id) {
        const result = await axios.patch(
          CONFIG.base_url_api + `/recipe`,
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
          CONFIG.base_url_api + `/recipe`,
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
        CONFIG.base_url_api + `/recipe?id=${formData?.id}`,
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
      <h2 className="text-2xl font-semibold">Daftar Resep</h2>

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
            {/* <div className="w-auto">
              <Button
                type="button"
                color="primary"
                className={
                  "flex gap-2 px-2 items-center lg:justify-start justify-center"
                }
                onClick={() => {
                  router.push(`/main/product/selling-price`);
                }}
              >
                <ClipboardList className="w-4" />
                Perkiraan Harga Jual
              </Button>
            </div> */}
            <div className="w-auto">
              {session?.role !== "admin_store" ? (
                <Button
                  type="button"
                  color="info"
                  className={
                    "flex gap-2 px-2 items-center lg:justify-start justify-center"
                  }
                  onClick={() => {
                    setModal({
                      ...modal,
                      open: true,
                      data: null,
                      key: "create",
                    });
                  }}
                >
                  <PlusIcon className="w-4" />
                  Resep
                </Button>
              ) : (
                ""
              )}
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
              {modal.key == "create" ? "Tambah" : "Ubah"} Data Resep
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
                isCurrency
                label="Harga Modal"
                placeholder="Masukkan Harga Modal"
                name="price"
                defaultValue={modal?.data?.price || ""}
                required
              />
              <TextArea
                label="Keterangan"
                isOptional
                name="remarks"
                defaultValue={modal?.data?.remarks || ""}
                placeholder="Masukkan keterangan"
              />

              {/* Product */}
              <div className="mt-2">
                <label htmlFor="products" className="text-gray-500">
                  Produk
                </label>
                <ReactSelect
                  id="products"
                  menuPlacement="top"
                  options={product?.map((v: any) => ({
                    ...v,
                    value: v.id,
                    label: v.name,
                  }))}
                  placeholder="Pilih Produk"
                  onChange={(e: any) => {
                    setList({
                      product:
                        list?.product?.length > 0 ? [...list?.product, e] : [e],
                    });
                    setProduct(
                      product?.filter((val: any) => val?.id !== e?.value)
                    );
                  }}
                />
              </div>
              {list?.product &&
                list?.product?.map((v: any, i: number) => (
                  <div
                    key={i}
                    className="mt-2 flex justify-between items-center gap-2"
                  >
                    <Input
                      value={v.label}
                      label={i == 0 ? "Nama Produk" : ""}
                      disabled
                    />
                    <Input
                      defaultValue={v.measure}
                      isCurrency
                      label={i == 0 ? "Takaran" : ""}
                      placeholder="Masukkan Takaran"
                      onValueChange={(values: any) => {
                        const newstate = list?.product?.map(
                          (val: any, idx: number) => {
                            if (i == idx) {
                              val.measure = values.floatValue;
                            }
                            return val;
                          }
                        );
                        setList({ product: newstate });
                      }}
                    />
                    <div className="w-full">
                      <Input
                        disabled
                        value={"gram"}
                        label={i == 0 ? "Satuan" : ""}
                      />
                    </div>
                    <button
                      type="button"
                      className={i == 0 ? "pt-5" : ""}
                      onClick={() => {
                        setList({
                          product: list?.product?.filter(
                            (val: any) => val?.id !== v?.id
                          ),
                        });
                        setProduct([
                          ...product,
                          products?.find((val: any) => val?.id == v?.id),
                        ]);
                      }}
                    >
                      <XCircleIcon className="text-red-500 w-7" />
                    </button>
                  </div>
                ))}
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
              Hapus Data Resep
            </h2>
            <form onSubmit={onRemove}>
              <input type="hidden" name="id" value={modal?.data?.id} />
              <p className="text-center my-2">
                Apakah anda yakin ingin menghapus {modal?.data?.name}?
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
        {modal?.key == "view" ? (
          <Modal
            open={modal.open}
            setOpen={() => setModal({ ...modal, open: false })}
          >
            <h2 className="text-xl font-semibold text-center">Bahan-bahan</h2>
            <div className="flex gap-2 justify-between mt-4">
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Produk</h5>
              </div>
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Takaran</h5>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.products)?.map((v: any, i: number) => (
                  <p key={i} className="font-semibold text-center">
                    {v?.name}
                  </p>
                ))}
              </div>
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.products)?.map((v: any, i: number) => (
                  <p className="text-center font-semibold" key={i}>
                    {v?.measure} gr
                  </p>
                ))}
              </div>
            </div>

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
            </div>
          </Modal>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
