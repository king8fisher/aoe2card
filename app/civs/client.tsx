"use client";

import { AllCivsHoverOver } from "~/src/components/molecules/CivView/AllCivsHoverOver";
import Navbar from "~/src/components/molecules/Navbar";
import { Container } from "~/src/styles";

const ClientOnly = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Container className="flex flex-col gap-2 pt-2">
        <AllCivsHoverOver reactToHovering />
      </Container>
    </div>
  );
};

export default ClientOnly;