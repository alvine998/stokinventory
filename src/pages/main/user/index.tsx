import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal, { useModal } from "@/components/Modal";
import Radio from "@/components/Radio";
import { CustomTableStyle } from "@/components/table/CustomTableStyle";
import { CONFIG } from "@/config";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  PencilIcon,
  PlusIcon,
  SaveAllIcon,
  Trash2Icon,
  TrashIcon,
  TriangleAlert,
} from "lucide-react";
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
        `/users?pagination=true&page=${+page - 1 || 0}&size=${
          +size || 10
        }&search=${search || ""}`,
      {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }
    );
    const stores = await axios.get(CONFIG.base_url_api + `/stores`, {
      headers: {
        "bearer-token": "stokinventoryapi",
        "x-partner-code": session?.partner_code,
      },
    });
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

export default function User({ table, session, stores }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(router.query);
  const [show, setShow] = useState<boolean>(false);
  const [modal, setModal] = useState<useModal>();
  const [role, setRole] = useState<any>("super_admin");
  const [info, setInfo] = useState<infoTypes>({
    loading: false,
    message: "",
    error_message: "",
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    const queryFilter = new URLSearchParams(filter).toString();
    router.push(`?${queryFilter}`);
  }, [filter]);
  const STORES = [{value:"", label:"Pilih Toko"},
    ...stores?.map((v: any) => ({
      ...v,
      value: v?.id,
      label: v?.name,
    })),
  ];
  const CustomerColumn: any = [
    {
      name: "Nama",
      sortable: true,
      selector: (row: any) => row?.name,
    },
    {
      name: "Email",
      sortable: true,
      selector: (row: any) => row?.email || "-",
    },
    {
      name: "No Telepon",
      sortable: true,
      selector: (row: any) => row?.phone || "-",
    },
    {
      name: "Toko",
      sortable: true,
      selector: (row: any) => row?.store_name || "-",
    },
    {
      name: "Peran",
      sortable: true,
      selector: (row: any) =>
        row?.role == "super_admin"
          ? "SUPER ADMIN"
          : row?.role == "admin_warehouse"
          ? "ADMIN GUDANG"
          : "ADMIN TOKO",
    },
    {
      name: "Status",
      sortable: true,
      selector: (row: any) => (row?.status == "1" ? "Aktif" : "Non Aktif"),
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
              setRole(row?.role);
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
    setInfo({ ...info, loading: true });
    const formData = Object.fromEntries(new FormData(e.target));
    let store = null;
    if(formData?.store){
      store = STORES?.find((v:any) => v?.id == formData?.store)
    }
    try {
      const payload = {
        ...formData,
        store_id: store?.id,
        store_name: store?.name,
        store_code: store?.code
      };
      if (formData?.id) {
        const result = await axios.patch(
          CONFIG.base_url_api + `/user`,
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
          CONFIG.base_url_api + `/user`,
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
      setInfo({ ...info, loading: false });
      setRole("super_admin");
      setModal({ ...modal, open: false });
      router.push("");
    } catch (error: any) {
      let errors = error?.response?.data;
      setInfo({
        ...info,
        loading: false,
        error_message: errors?.error_message || errors?.message,
      });
      console.log(error);
    }
  };
  const onRemove = async (e: any) => {
    try {
      e?.preventDefault();
      setInfo({ ...info, loading: true });
      const formData = Object.fromEntries(new FormData(e.target));
      const result = await axios.delete(
        CONFIG.base_url_api + `/user?id=${formData?.id}`,
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
      let errors = error?.response?.data;
      setInfo({
        ...info,
        loading: false,
        error_message: errors?.error_message || errors?.message,
      });
      console.log(error);
    }
  };
  const roles = [
    {
      value: "super_admin",
      label: "Super Admin",
    },
    {
      value: "admin_warehouse",
      label: "Admin Gudang",
    },
    {
      value: "admin_store",
      label: "Admin Toko",
    },
  ];
  return (
    <div>
      <h2 className="text-2xl font-semibold">Akses Admin</h2>

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
              Akses Admin
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
              {modal.key == "create" ? "Tambah" : "Ubah"} Akses Admin
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
                label="Email"
                placeholder="Masukkan Email"
                name="email"
                type="email"
                defaultValue={modal?.data?.email || ""}
              />
              <Input
                label="No Telepon"
                placeholder="Masukkan No Telepon"
                name="phone"
                type="number"
                defaultValue={modal?.data?.phone || ""}
              />
              <Input
                label="Password"
                placeholder="Masukkan Password"
                name="password"
                type="password"
                defaultValue={""}
                required={modal.key == "create"}
              />
              <Radio
                id="gender"
                name="gender"
                options={[
                  {
                    value: "L",
                    name: "Laki-laki",
                    checked: modal?.data?.gender == "L" || true,
                  },
                  {
                    value: "P",
                    name: "Perempuan",
                    checked: modal?.data?.gender == "P",
                  },
                ]}
                label="Jenis Kelamin"
              />
              <div>
                <label htmlFor="role" className="text-gray-500">
                  Peran
                </label>
                <ReactSelect
                  id="role"
                  menuPlacement="top"
                  name="role"
                  onChange={(e: any) => {
                    setRole(e.value);
                  }}
                  options={roles}
                  defaultValue={
                    roles?.find((v: any) => v.value == modal?.data?.role) ||
                    roles[0]
                  }
                />
              </div>
              {role == "admin_store" ? (
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
                    defaultValue={{
                      value:
                        STORES?.find(
                          (v: any) => v.value == modal?.data?.store_id
                        )?.id || "",
                      label:
                        STORES?.find(
                          (v: any) => v.value == modal?.data?.store_id
                        )?.name || "Pilih Toko",
                    }}
                  />
                </div>
              ) : (
                ""
              )}
              {modal.key == "update" ? (
                <div>
                  <div className="w-full my-2">
                    <label className="text-gray-500" htmlFor="x">
                      Status
                    </label>
                    <div className="flex gap-5">
                      <div className="flex gap-2">
                        <input
                          type="radio"
                          name="status"
                          value={"1"}
                          defaultChecked={modal?.data?.status == 1}
                        />
                        <span>Aktif</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="radio"
                          name="status"
                          value={"0"}
                          defaultChecked={modal?.data?.status == 0}
                        />
                        <span>Non Aktif</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {info.error_message ? (
                <div className="p-2 w-full bg-red-200 rounded my-2 flex items-center gap-3">
                  <TriangleAlert className="text-red-500" />
                  <p className="text-red-500">{info.error_message}</p>
                </div>
              ) : (
                ""
              )}
              <div className="flex lg:gap-2 gap-0 lg:flex-row flex-col-reverse justify-end mt-4">
                <div>
                  <Button
                    color="white"
                    type="button"
                    onClick={() => {
                      setModal({ open: false });
                      setRole("super_admin");
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
              Hapus Akses Admin
            </h2>
            <form onSubmit={onRemove}>
              <input type="hidden" name="id" value={modal?.data?.id} />
              <p className="text-center my-2">
                Apakah anda yakin ingin menghapus data {modal?.data?.name}?
              </p>
              {info.error_message && modal.key == "delete" ? (
                <div className="p-2 w-full bg-red-200 rounded my-2 flex items-center gap-3">
                  <TriangleAlert className="text-red-500" />
                  <p className="text-red-500">{info.error_message}</p>
                </div>
              ) : (
                ""
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
      </div>
    </div>
  );
}
