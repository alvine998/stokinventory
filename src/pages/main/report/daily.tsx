import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { generateTrxCode, toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  ClipboardList,
  EyeIcon,
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
        `/daily/reports?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const stores = await axios.get(
      CONFIG.base_url_api + `/stores?pagination=false`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const products = await axios.get(
      CONFIG.base_url_api + `/products?pagination=false`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const recipes = await axios.get(
      CONFIG.base_url_api + `/recipes?pagination=false`,
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
        stores: stores?.data?.items || [],
        products: products?.data?.items || [],
        recipes: recipes?.data?.items || [],
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

export default function Medicine({
  table,
  session,
  stores,
  products,
  recipes,
}: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [selected, setSelected] = useState<any>();
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
      name: "Kode Transaksi",
      sortable: true,
      selector: (row: any) => row?.trx_code,
    },
    {
      name: "Toko",
      sortable: true,
      selector: (row: any) => row?.store_name,
    },
    {
      name: "Produk",
      sortable: true,
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => {
            setModal({
              ...modal,
              open: true,
              key: "view",
              data: row,
            });
          }}
          className="text-blue-500"
        >
          Lihat
        </button>
      ),
    },
    {
      name: "Pendapatan",
      sortable: true,
      selector: (row: any) => toMoney(row?.total_price) || "0",
    },
    {
      name: "Jumlah Produk",
      sortable: true,
      selector: (row: any) => row?.total_product || "0",
    },
    {
      name: "Dilaporkan Oleh",
      sortable: true,
      selector: (row: any) => JSON.parse(row?.reported_by)?.name || "-",
    },
    {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2">
          {/* <Button
            title="Edit"
            color="primary"
            onClick={() => {
              setList({ product: JSON.parse(row?.products) });
              setModal({ ...modal, open: true, data: row, key: "update" });
            }}
          >
            <PencilIcon className="text-white w-5 h-5" />
          </Button> */}
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
      if (list?.product?.length < 1) {
        Swal.fire({
          icon: "warning",
          text: `Harap tambahkan produk!`,
        });
        setLoading(false);
        return;
      }
      if (list?.product?.find((v: any) => v.qty > v.stock)) {
        Swal.fire({
          icon: "warning",
          text: `Qty ${
            list?.product?.find((v: any) => v.qty > v.stock)?.name
          } lebih dari stok!`,
        });
        setLoading(false);
        return;
      }
      const payload = {
        ...formData,
        products: list?.product,
        reported_by: { id: session?.id, name: session?.name },
        total_price: +formData?.total_price?.replaceAll(".", ""),
        total_product: +formData?.total_product?.replaceAll(".", ""),
        trx_code: generateTrxCode(formData?.trx_code || null),
      };
      if (formData?.id) {
        const result = await axios.patch(
          CONFIG.base_url_api + `/daily/report`,
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
          CONFIG.base_url_api + `/daily/report`,
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
        CONFIG.base_url_api + `/daily/report?id=${formData?.id}`,
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
      <h2 className="text-2xl font-semibold">Laporan Harian</h2>

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
                Input Laporan Harian
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
            <div className="relative z-50">
              <h2 className="text-xl font-semibold text-center">
                Input Laporan Harian
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
                    Toko
                  </label>
                  <ReactSelect
                    id="store"
                    defaultValue={{
                      value: modal?.data?.store_id || "",
                      label: modal?.data?.store_name || "Pilih Toko",
                    }}
                    options={stores?.map((v: any) => ({
                      ...v,
                      value: v.id,
                      label: v.name,
                    }))}
                    onChange={(e) => {
                      setSelected(e);
                    }}
                    required
                    placeholder="Pilih Toko"
                    name="store"
                  />
                </div>

                <input type="hidden" name="store_id" value={selected?.id} />
                <input type="hidden" name="store_name" value={selected?.name} />

                <div className="mt-2">
                  <label htmlFor="products" className="text-gray-500">
                    Produk
                  </label>
                  <ReactSelect
                    id="products"
                    required
                    options={[
                      ...product?.map((v: any) => ({
                        ...v,
                        value: v.id,
                        label: v.name,
                      })),
                      ...recipes?.map((v: any) => ({
                        ...v,
                        value: v.id,
                        label: v.name,
                      })),
                    ]}
                    className="z-50"
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
                      value={v?.label || ""}
                      label={i == 0 ? "Nama Produk" : ""}
                      disabled
                    />
                    <Input
                      value={toMoney(v?.stock) || ""}
                      label={i == 0 ? "Stok" : ""}
                      disabled
                    />
                    <Input
                      value={toMoney(v?.price) || ""}
                      label={i == 0 ? "Harga" : ""}
                      disabled
                    />
                    <Input
                      value={v.qty}
                      isCurrency
                      required
                      label={i == 0 ? "Qty" : ""}
                      placeholder="Masukkan Qty"
                      onValueChange={(values: any) => {
                        let newQty = values.floatValue;
                        const newstate = list?.product?.map(
                          (val: any, idx: number) => {
                            if (i == idx) {
                              val.qty = newQty;
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
                      className="mt-6"
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
                  label="Jumlah Produk"
                  readOnly
                  value={toMoney(
                    list?.product?.reduce((a: any, b: any) => a + b.qty, 0) || 0
                  )}
                  name={"total_product"}
                />
                <Input
                  label="Jumlah Pendapatan"
                  readOnly
                  value={toMoney(
                    list?.product?.reduce(
                      (a: any, b: any) => a + b.price * b.qty,
                      0
                    ) || 0
                  )}
                  name={"total_price"}
                />

                <div className="flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end mt-6">
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
            </div>
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
              Hapus Data Laporan Harian
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

        {modal?.key == "view" ? (
          <Modal
            open={modal.open}
            setOpen={() => setModal({ ...modal, open: false })}
          >
            <h2 className="text-xl font-bold text-center">Barang Keluar</h2>
            <div className="flex gap-2 justify-between mt-4">
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Produk</h5>
              </div>
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Jumlah</h5>
              </div>
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Harga</h5>
              </div>
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Pendapatan</h5>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.products)?.length > 0 &&
                  JSON.parse(modal?.data?.products)?.map(
                    (v: any, i: number) => (
                      <p
                        key={i}
                        className={`${
                          i !== 0 ? "mt-2" : ""
                        } font-semibold text-center border-b-2 border-b-gray-800`}
                      >
                        {v?.name}
                      </p>
                    )
                  )}
              </div>
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.products)?.map((v: any, i: number) => (
                  <p
                    className={`${
                      i !== 0 ? "mt-2" : ""
                    } text-center font-semibold border-b-2 border-b-gray-800`}
                    key={i}
                  >
                    {v?.qty} {v?.unit}
                  </p>
                ))}
              </div>
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.products)?.map((v: any, i: number) => (
                  <p
                    className={`${
                      i !== 0 ? "mt-2" : ""
                    } text-center font-semibold border-b-2 border-b-gray-800`}
                    key={i}
                  >
                    Rp {toMoney(v?.price)}
                  </p>
                ))}
              </div>
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.products)?.map((v: any, i: number) => (
                  <p
                    className={`${
                      i !== 0 ? "mt-2" : ""
                    } text-center font-semibold border-b-2 border-b-gray-800`}
                    key={i}
                  >
                    Rp {toMoney(v?.price * v?.qty)}
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
