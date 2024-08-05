import ApexChart from "@/components/Chart";
import { CONFIG } from "@/config";
import axios from "axios";
import { getCookie } from "cookies-next";
import React from "react";

export async function getServerSideProps(context: any) {
  try {
    const { page, limit } = context.query;
    const { req, res } = context;
    let session: any = getCookie("session", { req, res });
    if (session) {
      session = JSON.parse(session);
    }
    const [products, stores, users] = await Promise.all([
      axios.get(CONFIG.base_url_api + `/products`, {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }),
      axios.get(CONFIG.base_url_api + `/stores`, {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }),
      axios.get(CONFIG.base_url_api + `/users`, {
        headers: {
          "bearer-token": "stokinventoryapi",
          "x-partner-code": session?.partner_code,
        },
      }),
    ]);
    return {
      props: {
        products: products?.data?.total_items || 0,
        stores: stores?.data?.total_items || 0,
        users: users?.data?.total_items || 0,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}

export default function Dashboard({ products, users, stores }: any) {
  return (
    <div>
      <div className="bg-blue-500 w-full h-auto p-2 rounded">
        <p className="text-white text-xl lg:text-left text-center">
          Selamat Datang Admin
        </p>
      </div>

      <div className="flex lg:flex-row flex-col gap-2 justify-between items-center mt-5">
        <div className="bg-green-500 w-full h-auto p-2 rounded">
          <h5 className="text-white font-semibold text-xl">Produk :</h5>
          <p className="text-white text-xl">{products || 0}</p>
        </div>

        <div className="bg-orange-500 w-full h-auto p-2 rounded">
          <h5 className="text-white font-semibold text-xl">Toko :</h5>
          <p className="text-white text-xl">{stores || 0}</p>
        </div>

        <div className="bg-blue-500 w-full h-auto p-2 rounded">
          <h5 className="text-white font-semibold text-xl">Admin :</h5>
          <p className="text-white text-xl">{users || 0}</p>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-xl">Grafik Pertumbuhan Stock Opname</h2>
        <ApexChart />
      </div>
    </div>
  );
}
