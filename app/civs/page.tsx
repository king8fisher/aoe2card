
"use client";
import dynamic from "next/dynamic";

const ClientOnly = dynamic(() => import("./client"), { ssr: false });

export default function Page() {
  return (
    <ClientOnly />
  );
};

