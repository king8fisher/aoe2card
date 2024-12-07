"use client"

import "../../src/styles/globals.css";
import { ClientOnly } from "./client";

const Page = () => {
  return (
    <>
      <ClientOnly />
    </>
  );
}

export default Page;