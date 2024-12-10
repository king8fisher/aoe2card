"use client";

import { useSearchParams } from "next/navigation";
import "../../src/styles/globals.css";
import { AllUnitsGrid } from "./AllUnitsGrid";

const Page = () => {
  const search = useSearchParams();

  return (
    <>
      <AllUnitsGrid filter={search?.get("q") || ""} />
    </>
  );
};

export default Page;
