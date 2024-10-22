import Button from "@/components/Button";
import generateInvoice from "@/components/GenerateInvoice";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import jsPDF from "jspdf";
import {
  CircleDivideIcon,
  ClipboardList,
  PencilIcon,
  PlusIcon,
  PrinterIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
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
        `/deliveries?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const stocks = await axios.get(
      CONFIG.base_url_api +
        `/stocks?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}&type=out&status=1`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const couriers = await axios.get(
      CONFIG.base_url_api + `/users?role=courier`,
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
        stocks: stocks?.data || [],
        couriers: couriers?.data?.items || [],
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

export default function Medicine({ table, session, stocks, couriers }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [selectableData, setSelectableData] = useState<any>([]);
  const [progress, setProgress] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);
  const generatePDF = async () => {
    setProgress(true);

    try {
      let doc: any = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [279, 241],
      });

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Delivery Invoice", 10, 20);
      doc.text(session?.partner?.name, 200, 20);

      doc.save("Delivery Invoice.pdf");
      setProgress(false);
    } catch (error) {
      setProgress(false);
      console.log(error);
    }
  };

  const CustomerColumn: any = [
    {
      name: "Stok Keluar",
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
      selector: (row: any) => JSON.parse(row?.delivered_by)?.name || "-",
    },
    {
      name: "Barang Antar",
      sortable: true,
      selector: (row: any) =>
        row?.image_deliver ? (
          <Image alt="bukti" src={row?.image_deliver} width={50} height={50} />
        ) : (
          "-"
        ),
    },
    {
      name: "Bukti Sampai",
      sortable: true,
      selector: (row: any) =>
        row?.image_arrived ? (
          <Image alt="bukti" src={row?.image_arrived} width={50} height={50} />
        ) : (
          "-"
        ),
    },
    {
      name: "Status",
      sortable: true,
      selector: (row: any) =>
        row?.status == 0
          ? "Menunggu"
          : row?.status == 1
          ? "Dalam Perjalanan"
          : row?.status == 2
          ? "Sampai Tujuan"
          : "Pending",
    },
    {
      name: "Aksi",
      right: true,
      selector: (row: any) => (
        <div className="flex gap-2">
          <Button
            title="Cetak"
            color="print"
            onClick={() => {
              // generatePDF();

              JSON.parse(row?.stocks)?.map((val: any) => {
                const invoiceData = {
                  invoiceNo: val?.id,
                  date: val?.created_on,
                  clientName: session?.partner?.name,
                  clientAddress: val?.store_name,
                  items: JSON.parse(val?.products),
                  courier_name: JSON.parse(row?.delivered_by)?.name
                };
                generateInvoice(invoiceData);
              });
            }}
            className={"flex gap-2 items-center w-full"}
          >
            {progress ? (
              <>
                <CircleDivideIcon className="w-5 h-5 animate-spin" />
                <p>Mencetak...</p>
              </>
            ) : (
              <PrinterIcon className="w-5 h-5" />
            )}
          </Button>
          <Button
            title="Edit"
            color="primary"
            onClick={() => {
              setSelectableData(JSON.parse(row?.stocks));
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

  const StockColumn: any = [
    {
      name: "Produk",
      sortable: true,
      selector: (row: any) =>
        JSON.parse(row?.products)?.map((v: any, i: number) => (
          <p key={i}>
            {i + 1}. {v?.name}
            <br />
          </p>
        )),
    },
    {
      name: "Toko Tujuan",
      sortable: true,
      selector: (row: any) => row?.store_name || "-",
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>();

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData: any = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        ...formData,
        delivered_by: { id: selected?.id, name: selected?.name },
        deliver_at: moment().format("YYYY-MM-DD hh:mm"),
        stocks: selectableData,
      };
      if (formData?.id) {
        const result = await axios.patch(
          CONFIG.base_url_api + `/delivery`,
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
          CONFIG.base_url_api + `/delivery`,
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
        CONFIG.base_url_api + `/delivery?id=${formData?.id}`,
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
                Pengiriman
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
              {modal.key == "create" ? "Tambah" : "Ubah"} Pengiriman
            </h2>
            <form onSubmit={onSubmit}>
              {modal.key == "update" && (
                <input
                  type="hidden"
                  name="id"
                  value={modal?.data?.id || null}
                />
              )}
              {modal.key == "update" && (
                <input
                  type="hidden"
                  name="stocks"
                  value={modal?.data?.stocks || null}
                />
              )}
              <div className="mt-5">
                {show && modal.key == "create" && (
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
                    paginationTotalRows={stocks?.total_items}
                    paginationDefaultPage={1}
                    paginationServer={true}
                    striped
                    columns={StockColumn}
                    data={stocks?.items || []}
                    selectableRows
                    onSelectedRowsChange={(state: any) =>
                      setSelectableData(state.selectedRows)
                    }
                    customStyles={CustomTableStyle}
                  />
                )}
              </div>
              <div className="mt-2">
                <label htmlFor="user" className="text-gray-500">
                  Kurir
                </label>
                <ReactSelect
                  id="user"
                  menuPlacement="top"
                  name="user"
                  required
                  options={couriers?.map((v: any) => ({
                    ...v,
                    value: v?.id,
                    label: v?.name,
                  }))}
                  onChange={(e) => {
                    setSelected(e);
                  }}
                  defaultValue={{
                    value:
                      modal.key == "update"
                        ? couriers?.find(
                            (v: any) =>
                              v.id == JSON.parse(modal?.data?.delivered_by)?.id
                          )?.id
                        : "",
                    label:
                      modal.key == "update"
                        ? couriers?.find(
                            (v: any) =>
                              v.id == JSON.parse(modal?.data?.delivered_by)?.id
                          )?.name
                        : "Pilih Kurir",
                  }}
                />
              </div>

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
              Hapus Pengiriman
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
                <h5 className="font-bold text-lg text-center">Stok ID</h5>
              </div>
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Jumlah Produk</h5>
              </div>
              <div className="bg-green-200 rounded p-2 w-full">
                <h5 className="font-bold text-lg text-center">Toko Tujuan</h5>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.stocks)?.length > 0 &&
                  JSON.parse(modal?.data?.stocks)?.map((v: any, i: number) => (
                    <p
                      key={i}
                      className={`${
                        i !== 0 ? "mt-2" : ""
                      } font-semibold text-center border-b-2 border-b-gray-800`}
                    >
                      {v?.id}
                    </p>
                  ))}
              </div>
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.stocks)?.map((v: any, i: number) => (
                  <p
                    className={`${
                      i !== 0 ? "mt-2" : ""
                    } text-center font-semibold border-b-2 border-b-gray-800`}
                    key={i}
                  >
                    {v?.qty} Kg
                  </p>
                ))}
              </div>
              <div className="bg-slate-100 rounded p-2 w-full">
                {JSON.parse(modal?.data?.stocks)?.map((v: any, i: number) => (
                  <p
                    className={`${
                      i !== 0 ? "mt-2" : ""
                    } text-center font-semibold border-b-2 border-b-gray-800`}
                    key={i}
                  >
                    {v?.store_name}
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
