import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ReactSelect from "react-select";

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
    const stores = await axios.get(
      CONFIG.base_url_api +
        `/stores?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}&id=${session?.store_id || ""}`,
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

export default function Medicine({ table, session, stores }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [items, setItems] = useState<any>([]);
  const [selectStore, setSelectStore] = useState<any>();
  const STORES = [
    { value: "", label: "Pilih Toko" },
    ...stores?.map((v: any) => ({
      ...v,
      value: v?.id,
      label: v?.name,
    })),
  ];
  const receiptRef = useRef<any>(null);
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
      selector: (row: any) =>
        `${
          row?.stock - (items?.find((v: any) => v?.id === row?.id)?.total || 0)
        } ${row?.unit}`,
    },
    {
      name: "Harga",
      sortable: true,
      selector: (row: any) => toMoney(row?.selling_price) || "0",
    },
    session?.role !== "admin_warehouse" && {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2 items-center">
          {items?.find((v: any) => v?.id === row?.id)?.total > 0 && (
            <Button
              title="Kurang"
              color="danger"
              onClick={() => {
                const newItems = items?.map((v: any) => {
                  if (v?.id === row?.id) {
                    v.total -= 1;
                    v.stock += 1;
                  }
                  return v;
                });
                setItems(newItems);
              }}
            >
              <MinusIcon className="text-white w-4 h-4" />
            </Button>
          )}
          <p>{items?.find((v: any) => v?.id === row?.id)?.total || 0}</p>
          <Button
            title="Tambah"
            color="primary"
            onClick={() => {
              // setModal({ ...modal, open: true, data: row, key: "delete" });
              if (
                row?.stock < 1 ||
                items?.find((v: any) => v?.id === row?.id)?.stock < 1
              ) {
                return Swal.fire({
                  icon: "warning",
                  text: "Stok tidak mencukupi",
                });
              }
              if (items?.find((v: any) => v?.id === row?.id)) {
                const newItems = items?.map((v: any) => {
                  if (v?.id === row?.id) {
                    v.total += 1;
                    v.stock -= 1;
                  }
                  return v;
                });
                setItems(newItems);
              } else {
                setItems([
                  ...items,
                  {
                    ...row,
                    total: (+row?.total || 0) + 1,
                    stock: +row?.stock - 1,
                  },
                ]);
              }
            }}
          >
            <PlusIcon className="text-white w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]?.filter((v: any) => v !== false);

  const [loading, setLoading] = useState<boolean>(false);

  const printReceipt = async (trx_code: string) => {
    // Generate PDF after form submission
    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [58, (canvas.height * 58) / canvas.width], // Set width to 58mm
    });

    pdf.addImage(imgData, "PNG", 0, 0, 58, (canvas.height * 58) / canvas.width);
    pdf.autoPrint(); // Optional: trigger print dialog
    pdf.save(`${trx_code}.pdf`); // Or send to printer
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        store_id: session?.store_id || selectStore?.id,
        store_name: session?.store_name || selectStore?.name,
        cashier_id: session?.id,
        cashier_name: session?.name,
        discount: 0,
        tax: 0,
        products: items?.map((v: any) => ({
          id: v?.id,
          name: v?.name,
          qty: v?.total,
          selling_price: v?.selling_price,
          price: v?.price,
        })),
      };
      const result = await axios.post(
        CONFIG.base_url_api + `/transaction`,
        payload,
        {
          headers: {
            "bearer-token": "stokinventoryapi",
            "x-partner-code": session?.partner_code,
          },
        }
      );
      printReceipt(result?.data?.items?.code);

      Swal.fire({
        icon: "success",
        text: "Data Berhasil Disimpan",
      });
      setLoading(false);
      setModal({ ...modal, open: false });
      setItems([]);
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
            <div>
              <Button
                type="button"
                onClick={() => {
                  setModal({ ...modal, open: true, data: items, key: "view" });
                }}
              >
                Lihat Struk
              </Button>
            </div>
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
        {modal?.key == "view" ? (
          <Modal
            open={modal.open}
            setOpen={() => setModal({ ...modal, open: false })}
          >
            <div className="flex justify-center items-center">
              <div
                ref={receiptRef}
                style={{
                  width: "58mm",
                  padding: "5mm",
                  fontSize: "10px",
                  lineHeight: "1.4",
                  fontFamily: "monospace",
                  background: "#fff",
                  color: "#000",
                  paddingBottom: "20px",
                }}
              >
                <h2 className="text-xl font-semibold text-center">
                  {session?.partner?.name}
                </h2>
                <h2 className="text-[7px] text-center mt-2">
                  {selectStore?.address || stores?.[0]?.address || ""}
                </h2>
                <h2 className="text-md font-semibold text-right uppercase mt-2">
                  Kasir: {session?.name}
                </h2>
                <p className="text-right">
                  {moment().format("DD-MM-YYYY HH:mm")}
                </p>
                <div>
                  <div className="flex gap-2 justify-between items-center mt-4">
                    <div className="w-full">
                      <p className="text-xs font-semibold">Item</p>
                    </div>
                    <div className="w-[150px]">
                      <p className="text-xs">Jumlah</p>
                    </div>
                    <div className="w-[150px]">
                      <p className="text-xs">Harga</p>
                    </div>
                  </div>
                  {items
                    ?.filter((v: any) => v?.total > 0)
                    ?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-2 justify-between items-center mt-4"
                      >
                        <div className="w-full">
                          <p className="text-[10px] font-semibold">
                            {item?.name}
                          </p>
                        </div>
                        <div className="w-[150px]">
                          <p className="text-xs ml-4">{item?.total}</p>
                        </div>
                        <div className="w-[150px]">
                          <p className="text-xs">
                            {toMoney(+item?.selling_price * +item?.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  <div className="border-b-2 border-gray-700 w-full mt-2"></div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs">Total Item</p>
                    <p className="text-xs">
                      {items?.filter((v: any) => v?.total > 0)?.length}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs">Total Harga</p>
                    <p className="text-xs">
                      Rp{" "}
                      {toMoney(
                        items?.reduce(
                          (a: any, b: any) => a + b.selling_price * b.total,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {session?.role == "super_admin" ? (
              <div className="mt-2">
                <label htmlFor="store" className="text-gray-500">
                  Toko
                </label>
                <ReactSelect
                  id="store"
                  menuPlacement="top"
                  name="store"
                  required
                  options={STORES}
                  onChange={(e: any) => {
                    setSelectStore(e);
                  }}
                  defaultValue={{
                    value:
                      STORES?.find((v: any) => v.value == modal?.data?.store_id)
                        ?.id || "",
                    label:
                      STORES?.find((v: any) => v.value == modal?.data?.store_id)
                        ?.name || "Pilih Toko",
                  }}
                />
              </div>
            ) : (
              ""
            )}

            <Button className={"mt-5"} type="button" onClick={onSubmit}>
              {loading ? "Memproses..." : "Simpan & Cetak"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setModal({ ...modal, open: false, data: null });
              }}
              color="white"
            >
              Tutup
            </Button>
          </Modal>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
