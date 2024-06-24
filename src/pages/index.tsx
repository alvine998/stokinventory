import Button from '@/components/Button'
import Input from '@/components/Input'
import { CONFIG } from '@/config'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export default function Login() {
  const router = useRouter();

  const login = async (e: any) => {
    e?.preventDefault();
    const formData: any = Object.fromEntries(new FormData(e.target))
    try {
      const payload = {
        ...formData
      }
      const result = await axios.post(CONFIG.base_url_api + '/users/login', payload)
      setCookie('session', JSON.stringify(result.data?.user))
      Swal.fire({
        icon: "success",
        text: "Selamat Datang Admin"
      })
      router.push('/main/dashboard')
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        text: error?.response?.data?.message
      })
    }
  }
  return (
    <div className='flex'>
      <Head>
        <title>LOGIN</title>
      </Head>
      <div className='w-full bg-green-500 h-[100vh] lg:flex flex-col gap-2 justify-center items-center hidden'>
        {/* <Image alt='icon-logo' src={'/images/tokotitoh.png'} layout='relative' width={300} height={300} className='w-[300px] h-[300px]' /> */}
        <h2 className='text-white font-bold text-3xl'>Aplikasi Sistem Pakar Puskesmas Sriamur</h2>
        <p className='text-white'>Dashboard Aplikasi Sistem Pakar Puskesmas Sriamur</p>
      </div>
      <div className='w-full bg-slate-50 h-[100vh] flex flex-col gap-2 justify-center items-center'>
        <div className='border border-gray-200 shadow rounded lg:w-1/2 w-full px-10 h-auto p-4'>
          <h2 className='text-center text-2xl font-semibold'>LOGIN</h2>
          <form className='mt-4' onSubmit={login}>
            <Input label='Email' placeholder='Masukkan Email' type='text' name='email' required />
            <Input label='Password' placeholder='********' type='password' name='password' required />
            {/* <a href="#" className='flex justify-end text-blue-500 hover:text-blue-700 duration-150 transition-all'>Lupa Password?</a> */}
            <div className='mt-5'>
              <Button color='info'>Masuk</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
