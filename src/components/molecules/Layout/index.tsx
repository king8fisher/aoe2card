import Navbar from "../Navbar";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps): JSX.Element => (
  <>
    <div className="min-h-screen mb-1">
      <Navbar />
      {children}
      {/* TODO: Add footer */}
    </div>
  </>
);

export default Layout;
