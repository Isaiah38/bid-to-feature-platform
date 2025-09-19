import { Navbar } from "../components/navbar";
import Footer from "../components/footer";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  LuLayoutDashboard,
  LuLifeBuoy,
  LuSettings,
  LuWallet,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { ButtonOutline, DashboardNavBtn } from "~/components/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router";
import { navRoutes } from "~/utils/constants";
import { useEffect, useState } from "react";
import CopyToClipBoard from "~/components/copyToClipBoard";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
  const { publicKey, disconnect } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      navigate(navRoutes.home);
    }
    setMobileOpen(false);
  }, [publicKey, location]);

  const sidebarContent = (
    <>
      <div className="px-6 py-4 border-b border-gray-200">
        <Link className="hidden lg:block text-xl font-bold text-[#9bd32c]" to={navRoutes.home}>
          Gemspot
        </Link>
        <div className="text-sm flex items-center gap-2 text-gray-700 ">
          <LuWallet className="h-4 w-4 text-gray-400" />
          {publicKey
            ? `${publicKey.toString().slice(0, 8)}...${publicKey
                .toString()
                .slice(-8)}`
            : "Wallet not connected"}

          {publicKey && <CopyToClipBoard text={publicKey.toString()} />}
        </div>
      </div>

      <nav className="space-y-2 p-4">
        <DashboardNavBtn
          text="Dashboard"
          url={navRoutes.dashboard}
          icon={<LuLayoutDashboard className="h-4 w-4" />}
        />

        <DashboardNavBtn
          text="Book Space"
          url={navRoutes.bookSpace}
          icon={<LuLifeBuoy className="h-4 w-4" />}
        />

        <DashboardNavBtn
          text="Settings"
          url="#"
          icon={<LuSettings className="h-4 w-4" />}
        />
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="border-r border-gray-300 shadow-xs h-screen hidden lg:block">
          {sidebarContent}
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />

              {/* Sliding Drawer */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-75 bg-white shadow-lg z-50 lg:hidden"
              >
                <div className="flex justify-between items-center p-4 ">
                  <Link
                    className="text-xl font-bold text-[#9bd32c]"
                    to={navRoutes.home}
                  >
                    Gemspot
                  </Link>
                  <button onClick={() => setMobileOpen(false)}>
                    <LuX className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <LuMenu className="h-6 w-6 text-gray-700" />
            </button>
            <ButtonOutline text="Disconnect" onClick={disconnect} />
          </div>

          {/* Page Header */}
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="space-y-1">
              {location.pathname === navRoutes.dashboard && (
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
              )}
            </div>
            <div className="hidden lg:block">
              <ButtonOutline text="Disconnect Wallet" onClick={disconnect} />
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
