import NavbarDesktop from "@/components/navbar/NavbarDesktop";
import Head from "next/head";
import React, { ReactNode, useEffect, useState } from "react";
import NavbarMobile from "../navbar/NavbarMobile";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import axios from "axios";
import { CONFIG } from "@/config";
import NavbarHomeDesktop from "../navbar/NavbarHomeDesktop";

export default function LayoutHome({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<any>();
  const [partners, setPartners] = useState<any>([]);
  const getPartners = async () => {
    try {
      const result = await axios.get(
        CONFIG.base_url_api +
          `/partners`,
        {
          headers: {
            "bearer-token": "stokinventoryapi"
          },
        }
      );
      setPartners(result.data.items)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getPartners();
    let sessions: any = getCookie("session");
    if (sessions) {
      setSession(JSON.parse(sessions));
    }
  }, []);
  return (
    <section className="min-h-screen overflow-x-hidden relative">
      <Head>
        <title>StokInventory</title>
      </Head>
      <div className="lg:block hidden">
        <NavbarHomeDesktop>{children}</NavbarHomeDesktop>
      </div>
      {/* <div className="lg:hidden block">
        <NavbarMobile session={session}>{children}</NavbarMobile>
      </div> */}
    </section>
  );
}
