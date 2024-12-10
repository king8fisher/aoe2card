import Navbar from "../Navbar";

import type { JSX } from "react";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps): JSX.Element => (
  <>
    <div className="min-h-screen">
      <Navbar />
      {children}
      {/* TODO: Add footer */}
    </div>
  </>
);

export default Layout;
