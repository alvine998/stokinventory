import NavbarDesktop from "@/components/navbar/NavbarDesktop";
import Head from "next/head";
import React, { ReactNode, useEffect, useState } from "react";
import NavbarMobile from "../navbar/NavbarMobile";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

export default function LayoutDashboard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<any>();
  useEffect(() => {
    let sessions: any = getCookie("session");
    if (sessions) {
      setSession(JSON.parse(sessions));
    }
  }, []);
  return (
    <section className="min-h-screen overflow-x-hidden relative">
      <Head>
        <title>Dashboard - StokInventory</title>
      </Head>
      <div className="lg:block hidden">
        <NavbarDesktop session={session}>{children}</NavbarDesktop>
      </div>
      <div className="lg:hidden block">
        <NavbarMobile session={session}>{children}</NavbarMobile>
      </div>
    </section>
  );
}
