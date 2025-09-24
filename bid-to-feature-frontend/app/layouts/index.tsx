import { Navbar } from "../components/navbar";
import Footer from "../components/footer";
import { Outlet } from "react-router";
import { NotificationProvider } from "../components/notification/use-notification";
import { NotificationContainer } from "../components/notification/NotificationContainer";

export default function AppLayout() {
  return (
    <NotificationProvider>
      <Navbar />
      <Outlet />
      <NotificationContainer />
      <Footer />
    </NotificationProvider>
  );
}
