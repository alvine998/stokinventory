import Button from "@/components/Button";
import Input from "@/components/Input";
import { CONFIG } from "@/config";
import axios from "axios";
import { setCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (e: any) => {
    e?.preventDefault();
    setLoading(true);
    const formData: any = Object.fromEntries(new FormData(e.target));
    try {
      const payload = {
        ...formData,
      };
      const result = await axios.post(
        CONFIG.base_url_api + "/user/auth",
        payload,
        {
          headers: {"bearer-token": "stokinventoryapi"}
        }
      );
      const partner = await axios.get(
        CONFIG.base_url_api + `/partners?package_name=${result?.data?.user?.partner_code}`,
        {
          headers: {"bearer-token": "stokinventoryapi"}
        }
      );
      setCookie("session", JSON.stringify({...result.data?.user, partner: partner.data?.items[0]}));
      Swal.fire({
        icon: "success",
        text: `Selamat Datang ${result.data?.user?.name}`,
      });
      setLoading(false);
      router.push("/main/dashboard");
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: error?.response?.data?.message,
      });
    }
  };
  return (
    <div className="flex">
      <Head>
        <title>LOGIN</title>
      </Head>
      <div className="w-full bg-blue-500 h-[100vh] lg:flex flex-col gap-2 justify-center items-center hidden">
        {/* <Image alt='icon-logo' src={'/images/tokotitoh.png'} layout='relative' width={300} height={300} className='w-[300px] h-[300px]' /> */}
        <h2 className="text-white font-bold text-3xl">StokInventory</h2>
        <p className="text-white">Manage Your Data Stocks From Here</p>
      </div>
      <div className="w-full bg-slate-50 h-[100vh] flex flex-col gap-2 justify-center items-center">
        <div className="border border-gray-200 shadow rounded lg:w-1/2 w-full px-10 h-auto p-4">
          <h2 className="text-center text-2xl font-semibold">StokInventory</h2>
          <form className="mt-4" onSubmit={login}>
            <Input
              label="Email / No Telepon"
              placeholder="Masukkan Email / No Telepon"
              type="text"
              name="identity"
              required
            />
            <Input
              label="Password"
              placeholder="********"
              type="password"
              name="password"
              required
            />
            {/* <a href="#" className='flex justify-end text-blue-500 hover:text-blue-700 duration-150 transition-all'>Lupa Password?</a> */}
            <div className="mt-5">
              <Button color="info" disabled={loading}>
                {loading ? "Menunggu..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
