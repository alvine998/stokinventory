import Button from "@/components/Button";
import FileUpload from "@/components/FileUpload";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import Radio from "@/components/Radio";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { storage } from "@/config/firebase";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
  UploadCloudIcon,
  XCircleIcon,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import SOTabs from "..";

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
        `/stocks?page=${+page || 1}&size=${+size || 10}&search=${
          search || ""
        }&type=out`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    console.log(result?.data?.items[0]);
    const products = await axios.get(
      CONFIG.base_url_api +
        `/products?page=${+page || 1}&size=${+size || 100}&search=${
          search || ""
        }`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const stores = await axios.get(
      CONFIG.base_url_api +
        `/stores?page=${+page || 1}&size=${+size || 100}&search=${
          search || ""
        }`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const suppliers = await axios.get(
      CONFIG.base_url_api +
        `/suppliers?page=${+page || 1}&size=${+size || 100}&search=${
          search || ""
        }`,
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
        products: products.data?.items || [],
        stores: stores.data?.items || [],
        suppliers: suppliers.data?.items || [],
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

export default function Stock({
  table,
  session,
  products,
  stores,
  suppliers,
}: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [list, setList] = useState<any>({ product: [] });
  const [product, setProduct] = useState<any>(products);
  const [selected, setSelected] = useState<any>();
  const [image, setImage] = useState<any>();
  const [progress, setProgress] = useState<any>();
  const [info, setInfo] = useState<infoTypes>({
    loading: false,
    message: "",
    error_message: "",
  });
  const [type, setType] = useState<string>("in");
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
      selector: (row: any) => moment(row?.date).format("DD-MM-YYYY hh:mm"),
    },
    {
      name: "Jenis",
      sortable: true,
      selector: (row: any) =>
        row?.type == "in" ? "Barang Masuk" : "Barang Keluar",
    },
    {
      name: "Produk",
      sortable: true,
      selector: (row: any) => (
        <button
          className="text-blue-500"
          type="button"
          onClick={() => {
            setModal({
              ...modal,
              open: true,
              data: row,
              key: "view",
            });
          }}
        >
          Lihat List Produk
        </button>
      ),
    },
    {
      name: "Jumlah Produk",
      sortable: true,
      selector: (row: any) => toMoney(row?.qty),
    },
    {
      name: "Bukti",
      sortable: true,
      selector: (row: any) => (
        <a href={row?.image} className="text-blue-500">
          Lihat
        </a>
      ),
    },
    {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2">
          {session?.role === "super_admin" && (
            <Button
              title="Hapus"
              color="danger"
              onClick={() => {
                setModal({ ...modal, open: true, data: row, key: "delete" });
              }}
            >
              <TrashIcon className="text-white w-5 h-5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleImage = async (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Set compression options
      const options = {
        maxSizeMB: 0.1, // Maximum size in MB
        maxWidthOrHeight: 1000, // Max width or height (maintains aspect ratio)
        useWebWorker: true, // Use multi-threading for compression
      };
      const storageRef = ref(storage, `images/stock/${type}/${file?.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
          });
        }
      );
    }
  };

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setInfo({ ...info, loading: true });
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        ...formData,
        store_id: +formData?.store_id || null,
        image: image,
        products: list?.product,
        qty: list?.product?.reduce((a: any, b: any) => a + +b.qty, 0),
        logs: { id: session?.id, name: session?.name },
      };
      let result: any = null;

      result = await axios.post(CONFIG.base_url_api + `/stock`, payload, {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      });
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Disimpan",
      });
      setImage(null);
      setList({ product: [] });
      setProduct(products);
      setInfo({ ...info, loading: false });
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error: any) {
      console.log(error);
      let errors = error?.response?.data;
      setInfo({ ...info, loading: false });
      Swal.fire({
        icon: "error",
        text: errors?.error_message || errors?.message || "Error",
      });
    }
  };
  const onRemove = async (e: any) => {
    try {
      e?.preventDefault();
      setInfo({ ...info, loading: true });
      const formData: any = Object.fromEntries(new FormData(e.target));
      const result = await axios.patch(
        CONFIG.base_url_api + `/stock`,
        { ...formData, products: JSON.parse(formData?.products) },
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
      setInfo({ ...info, loading: false });
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error: any) {
      console.log(error);
      let errors = error?.response?.data;
      setInfo({ ...info, loading: false });
      Swal.fire({
        icon: "error",
        text: errors?.error_message || errors?.message || "Error",
      });
    }
  };
  return (
    <SOTabs>
      <div>
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
                  setFilter({ ...filter, page: currentPage, size: currentRow });
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
                <div className="mt-2">
                  <label htmlFor="store" className="text-gray-500">
                    Toko Tujuan
                  </label>
                  <ReactSelect
                    id="store"
                    options={stores?.map((v: any) => ({
                      ...v,
                      value: v.id,
                      label: v.name,
                    }))}
                    onChange={(e) => {
                      setSelected(e);
                    }}
                    required
                    placeholder="Pilih Toko Tujuan"
                    name="store"
                  />
                </div>

                <input type="hidden" name="store_id" value={selected?.id} />
                <input type="hidden" name="store_name" value={selected?.name} />
                <input type="hidden" name="store_code" value={selected?.code} />
                <input type="hidden" name="type" value={"out"} />

                <div className="mt-2">
                  <label htmlFor="products" className="text-gray-500">
                    Produk
                  </label>
                  <ReactSelect
                    id="products"
                    options={product?.map((v: any) => ({
                      ...v,
                      value: v.id,
                      label: v.name,
                    }))}
                    placeholder="Pilih Produk"
                    onChange={(e: any) => {
                      setList({
                        product:
                          list?.product?.length > 0
                            ? [...list?.product, e]
                            : [e],
                      });
                      setProduct(
                        product?.filter((val: any) => val?.id !== e?.value)
                      );
                    }}
                  />
                </div>
                {list?.product?.map((v: any, i: number) => (
                  <div key={i} className="mt-2 flex justify-between gap-2">
                    <Input
                      value={v.label}
                      label={i == 0 ? "Nama Produk" : ""}
                      disabled
                    />
                    <Input
                      value={v.qty}
                      isCurrency
                      label={i == 0 ? "Jumlah Produk" : ""}
                      placeholder="Masukkan Jumlah Produk"
                      onValueChange={(values: any) => {
                        const newstate = list?.product?.map(
                          (val: any, idx: number) => {
                            if (i == idx) {
                              val.qty = values.floatValue;
                            }
                            return val;
                          }
                        );
                        setList({ product: newstate });
                      }}
                    />
                    <Input
                      value={v.expired_at}
                      type="datetime-local"
                      defaultValue={moment().format("DD-MM-YYYY hh:mm")}
                      label={i == 0 ? "Tanggal Kadaluwarsa" : ""}
                      onChange={(e: any) => {
                        const newstate = list?.product?.map(
                          (val: any, idx: number) => {
                            if (i == idx) {
                              val.expired_at = e.target.value;
                            }
                            return val;
                          }
                        );
                        setList({ product: newstate });
                      }}
                    />
                    <div>
                      <Input
                        disabled
                        value={v.unit}
                        label={i == 0 ? "Satuan" : ""}
                      />
                    </div>
                    <button
                      type="button"
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
                <Input
                  label="Waktu"
                  name="date"
                  defaultValue={
                    modal?.data?.date || moment().format("YYYY-MM-DD HH:mm")
                  }
                  type="datetime-local"
                  required
                />
                <FileUpload
                  image={image}
                  label="Bukti"
                  onChange={handleImage}
                  name="image"
                  defaultValue={image || ""}
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
                      disabled={info.loading}
                      className={"flex gap-2 px-2 items-center justify-center"}
                    >
                      <SaveAllIcon className="w-4 h-4" />
                      {info.loading ? "Menyimpan..." : "Simpan"}
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
                Hapus Data Stok
              </h2>
              <form onSubmit={onRemove}>
                <input type="hidden" name="id" value={modal?.data?.id} />
                <input
                  type="hidden"
                  name="products"
                  value={modal?.data?.products}
                />
                <p className="text-center my-2">
                  Apakah anda yakin ingin menghapus data ini?
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
                      disabled={info.loading}
                      className={"flex gap-2 px-2 items-center justify-center"}
                    >
                      <Trash2Icon className="w-4 h-4" />
                      {info.loading ? "Menghapus..." : "Hapus"}
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
              <h2 className="text-xl font-bold text-center">
                Produk Barang Keluar
              </h2>
              <div className="flex gap-2 justify-between mt-4">
                <div className="bg-green-200 rounded p-2 w-full">
                  <h5 className="font-bold text-lg text-center">Nama Produk</h5>
                </div>
                <div className="bg-green-200 rounded p-2 w-full">
                  <h5 className="font-bold text-lg text-center">
                    Jumlah Produk
                  </h5>
                </div>
              </div>
              <div className="flex gap-2 justify-between">
                <div className="bg-slate-100 rounded p-2 w-full">
                  {JSON.parse(modal?.data?.products)?.length > 0 && JSON.parse(modal?.data?.products)?.map(
                    (v: any, i: number) => (
                      <p
                        key={i}
                        className={`${
                          i !== 0 ? "mt-2" : ""
                        } font-semibold text-center border-b-2 border-b-gray-800`}
                      >
                        {v?.name?.toUpperCase()}
                      </p>
                    )
                  )}
                </div>
                <div className="bg-slate-100 rounded p-2 w-full">
                  {JSON.parse(modal?.data?.products)?.map(
                    (v: any, i: number) => (
                      <p
                        className={`${
                          i !== 0 ? "mt-2" : ""
                        } text-center font-semibold border-b-2 border-b-gray-800`}
                        key={i}
                      >
                        {v?.qty} {v?.unit}
                      </p>
                    )
                  )}
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
    </SOTabs>
  );
}
