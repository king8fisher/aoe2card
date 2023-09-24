import Navbar from "../Navbar";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps): JSX.Element => (
  <>
    <Navbar />
    {children}
    {/* TODO: Add fotter */}
  </>
);

export default Layout;
