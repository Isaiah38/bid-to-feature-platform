import { Navbar } from "../components/navbar";
import Footer from "../components/footer";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
