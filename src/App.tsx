import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import Layout from "./components/molecules/Layout";
import Home from "./pages/Home";

setBasePath("/shoelace");

const App = () => (
  <Layout>
    <Home />
  </Layout>
);

export default App;
