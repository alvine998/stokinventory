import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import RootLayout from './layout';
import LayoutDashboard from '@/components/layout/LayoutDashboard';
import NextNProgress from 'nextjs-progressbar'
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return router.pathname?.includes('/main') || router.pathname?.includes('/404') ?
    <RootLayout>
      <NextNProgress color="blue" nonce="my-nonce" />
      <LayoutDashboard>
        <Component {...pageProps} />
      </LayoutDashboard>
    </RootLayout>
    :
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
}
