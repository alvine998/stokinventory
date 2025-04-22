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
    const { page, size, search, trx_code } = context.query;
    const { req, res } = context;
    let session: any = getCookie("session", { req, res });
    if (session) {
      session = JSON.parse(session);
    }
    const result = await axios.get(
      CONFIG.base_url_api +
        `/transactions?pagination=true&page=${+page - 1 || 0}&size=${
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
    let detail: any = [];
    if (trx_code) {
      detail = await axios.get(
        CONFIG.base_url_api + `/transaction/details?trx_code=${trx_code}`,
        {
          headers: {
            "bearer-token": "stokinventoryapi",
            "x-partner-code": session?.partner_code,
          },
        }
      );
    }
    return {
      props: {
        table: result?.data || [],
        stores: stores?.data?.items || [],
        detail: detail?.data || [],
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

export default function ReportTransactionPage({
  table,
  session,
  stores,
  detail,
}: any) {
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
      name: "Kode Transaksi",
      sortable: true,
      selector: (row: any) => row?.code,
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
            setFilter({ ...filter, trx_code: row?.code });
          }}
          className="text-blue-500"
        >
          Lihat
        </button>
      ),
    },
    {
      name: "Total Bayar",
      sortable: true,
      selector: (row: any) => toMoney(row?.price) || "0",
    },
    {
      name: "Jumlah Produk",
      sortable: true,
      selector: (row: any) => row?.qty || "0",
    },
    {
      name: "Dilaporkan Oleh",
      sortable: true,
      selector: (row: any) => row?.cashier_name || "-",
    },
    // {
    //   name: "Aksi",
    //   right: true,
    //   selector: (row: any) => (
    //     <div className="flex gap-2">
    //       {/* <Button
    //         title="Edit"
    //         color="primary"
    //         onClick={() => {
    //           setList({ product: JSON.parse(row?.products) });
    //           setModal({ ...modal, open: true, data: row, key: "update" });
    //         }}
    //       >
    //         <PencilIcon className="text-white w-5 h-5" />
    //       </Button> */}
    //       <Button
    //         title="Hapus"
    //         color="danger"
    //         onClick={() => {
    //           setModal({ ...modal, open: true, data: row, key: "delete" });
    //         }}
    //       >
    //         <TrashIcon className="text-white w-5 h-5" />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const DetailColumn: any = [
    {
      name: "Item",
      sortable: true,
      selector: (row: any) => row?.product_name,
    },
    {
      name: "Jumlah",
      sortable: true,
      selector: (row: any) => row?.product_qty || "0",
    },
    {
      name: "Harga Satuan",
      sortable: true,
      selector: (row: any) => toMoney(row?.product_price) || "0",
    },
    {
      name: "Total Harga",
      sortable: true,
      selector: (row: any) => toMoney(row?.subtotal || 0),
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);

  //   const onSubmit = async (e: any) => {
  //     e?.preventDefault();
  //     setLoading(true);
  //     const formData: any = Object.fromEntries(new FormData(e.target));
  //     try {
  //       if (list?.product?.length < 1) {
  //         Swal.fire({
  //           icon: "warning",
  //           text: `Harap tambahkan produk!`,
  //         });
  //         setLoading(false);
  //         return;
  //       }
  //       if (list?.product?.find((v: any) => v.qty > v.stock)) {
  //         Swal.fire({
  //           icon: "warning",
  //           text: `Qty ${
  //             list?.product?.find((v: any) => v.qty > v.stock)?.name
  //           } lebih dari stok!`,
  //         });
  //         setLoading(false);
  //         return;
  //       }
  //       const payload = {
  //         ...formData,
  //         products: list?.product,
  //         reported_by: { id: session?.id, name: session?.name },
  //         total_price: +formData?.total_price?.replaceAll(".", ""),
  //         total_product: +formData?.total_product?.replaceAll(".", ""),
  //         trx_code: generateTrxCode(formData?.trx_code || null),
  //       };
  //       if (formData?.id) {
  //         const result = await axios.patch(
  //           CONFIG.base_url_api + `/daily/report`,
  //           payload,
  //           {
  //             headers: {
  //               "bearer-token": "stokinventoryapi",
  //               "x-partner-code": session?.partner_code,
  //             },
  //           }
  //         );
  //       } else {
  //         const result = await axios.post(
  //           CONFIG.base_url_api + `/daily/report`,
  //           payload,
  //           {
  //             headers: {
  //               "bearer-token": "stokinventoryapi",
  //               "x-partner-code": session?.partner_code,
  //             },
  //           }
  //         );
  //       }
  //       Swal.fire({
  //         icon: "success",
  //         text: "Data Berhasil Disimpan",
  //       });
  //       setLoading(false);
  //       setModal({ ...modal, open: false });
  //       router.push("");
  //     } catch (error) {
  //       setLoading(false);
  //       console.log(error);
  //     }
  //   };
  //   const onRemove = async (e: any) => {
  //     try {
  //       e?.preventDefault();
  //       setLoading(true);
  //       const formData = Object.fromEntries(new FormData(e.target));
  //       const result = await axios.delete(
  //         CONFIG.base_url_api + `/daily/report?id=${formData?.id}`,
  //         {
  //           headers: {
  //             "bearer-token": "stokinventoryapi",
  //             "x-partner-code": session?.partner_code,
  //           },
  //         }
  //       );
  //       Swal.fire({
  //         icon: "success",
  //         text: "Data Berhasil Dihapus",
  //       });
  //       setLoading(false);
  //       setModal({ ...modal, open: false });
  //       router.push("");
  //     } catch (error) {
  //       setLoading(false);
  //       console.log(error);
  //     }
  //   };
  return (
    <div>
      <h2 className="text-2xl font-semibold">Laporan Transaksi</h2>

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
          <div className="lg:w-auto w-full flex gap-2"></div>
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
        {/* {modal?.key == "delete" ? (
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
        )} */}

        {modal?.key == "view" ? (
          <Modal
            open={modal.open}
            setOpen={() => setModal({ ...modal, open: false })}
          >
            <h2 className="text-xl font-bold text-center mb-4">List Produk</h2>
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
                paginationTotalRows={detail?.total_items}
                paginationDefaultPage={1}
                paginationServer={true}
                striped
                columns={DetailColumn}
                data={detail?.items}
                customStyles={CustomTableStyle}
              />
            )}
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
