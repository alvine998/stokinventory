import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import { toMoney } from "@/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import { ArrowLeftCircleIcon, PlusIcon, SaveAllIcon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export async function getServerSideProps(context: any) {
  try {
    const { page, size, search } = context.query;
    const { req, res, params } = context;
    let session: any = getCookie("session", { req, res });
    if (session) {
      session = JSON.parse(session);
    }
    let stock: any = await axios.get(
      CONFIG.base_url_api + `/stocks?store_id=${params?.id}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const detail = await axios.get(
      CONFIG.base_url_api + `/stores?id=${params?.id}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const product = await axios.get(
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
    let qty = [];
    stock = stock?.data?.items;
    for (let index = 0; index < stock.length; index++) {
      const element = stock[index];
      qty.push(...JSON.parse(element?.products));
    }
    qty = qty?.reduce((a: any, b: any) => {
      const exist = a?.find((v: any) => v?.id == b?.id);
      if (exist) {
        exist.stock += b.qty;
      } else {
        a.push({ id: b.id, name: b.name, code: b.code, stock: b.qty });
      }
      return a;
    }, []);
    return {
      props: {
        table: product?.data || [],
        detail: detail?.data?.items[0],
        stock: qty || [],
        session,
        params
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

export default function Medicine({ table, session, detail, stock, params }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [loading, setLoading] = useState<boolean>(false);
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
      name: "Stok",
      sortable: true,
      selector: (row: any) =>
        (stock?.find((v: any) => v?.id == row?.id)?.stock || 0) +
        ` ${row?.unit}`,
    },
    {
      name: "Aksi",
      sortable: true,
      selector: (row: any) => (
        <div>
          <Button
            type="button"
            onClick={() => {
              setModal({ ...modal, open: true, key: "add", data: row });
            }}
          >
            Ubah
          </Button>
        </div>
      ),
    },
    // {
    //   name: "Masa Kadaluwarsa",
    //   sortable: true,
    //   selector: (row: any) => row?.expired_at || "-",
    // },
    {
      name: "Status",
      sortable: true,
      selector: (row: any) => row?.status || "-",
    },
  ];

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData: any = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        store_id: +formData?.store_id || null,
        store_name: formData?.store_name,
        image: "admin_input",
        products: [{
          id: formData?.product_id,
          name: formData?.product_name,
          expired_at: formData?.expired_at,
          qty: +formData?.qty,
          code: formData?.product_code
        }],
        qty: +formData?.qty,
        logs: { id: session?.id, name: session?.name },
        date: new Date(),
        type: "out",
        status: 2
      };
      const result = await axios.post(
        CONFIG.base_url_api + `/stock/create/store`,
        payload,
        {
          headers: {
            "bearer-token": "stokinventoryapi",
            "x-partner-code": session?.partner_code,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Data Berhasil Disimpan",
      });
      setLoading(false);
      setModal({ ...modal, open: false });
      router.push(`/main/store/${params?.id}/detail`);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mt-5">
        <div className="flex lg:flex-row flex-col justify-between items-center">
          <div>
            <Button
              type="button"
              onClick={() => {
                router.push("/main/store");
              }}
              className={"px-4 flex gap-2 items-center"}
              color="white"
            >
              <ArrowLeftCircleIcon />
              Kembali
            </Button>
          </div>
        </div>
        <div className="w-full py-4 px-4 bg-white border rounded">
          <h2 className="text-2xl font-semibold">Detail Toko</h2>
          <div className="flex flex-wrap flex-row gap-2 mt-5">
            <div className="w-[370px] border-b-2 border-b-gray-600">
              <p>
                Kode Toko: <br />
                {detail?.code}
              </p>
            </div>
            <div className="w-[370px] border-b-2 border-b-gray-600">
              <p>
                Nama Toko: <br />
                {detail?.name}
              </p>
            </div>
            <div className="w-[370px] border-b-2 border-b-gray-600">
              <p>
                Alamat: <br />
                {detail?.address}
              </p>
            </div>
          </div>
        </div>
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

        {modal?.key == "add" ? (
          <Modal
            open={modal.open}
            setOpen={() => {
              setModal({ ...modal, open: false });
            }}
          >
            <h2 className="text-center text-xl font-bold">
              Ubah Stok {modal?.data?.name}
            </h2>
            <form onSubmit={onSubmit}>
              <div>
                <input type="hidden" name="product_id" value={modal?.data?.id} />
                <input type="hidden" name="product_name" value={modal?.data?.name} />
                <input type="hidden" name="product_code" value={modal?.data?.code} />
                <input type="hidden" name="store_id" value={detail?.id} />
                <input type="hidden" name="store_name" value={detail?.name} />
                <Input
                  label={`Jumlah per ${modal?.data?.unit}`}
                  placeholder="Masukkan Jumlah Produk"
                  type="number"
                  name={"qty"}
                />
                <Input
                  label={`Tanggal Kadaluwarsa`}
                  type="date"
                  name={"expired_at"}
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
      </div>
    </div>
  );
}
