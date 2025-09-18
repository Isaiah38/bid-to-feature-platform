import { Navbar } from "../components/navbar";
import Footer from "../components/footer";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  LuLayoutDashboard,
  LuLifeBuoy,
  LuSettings,
  LuWallet,
} from "react-icons/lu";
import { ButtonOutline, DashboardNavBtn } from "~/components/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router";
import { navRoutes } from "~/utils/constants";
import { useEffect } from "react";
import CopyToClipBoard from "~/components/copyToClipBoard";

export default function DashboardLayout() {
  const { publicKey, disconnect } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!publicKey) {
      navigate(navRoutes.home);
    }
  }, [publicKey]);
  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="grid lg:grid-cols-[280px_1fr]">
          <aside className="border-r border-gray-300 shadow-xs h-screen hidden lg:block ">
            <div className=" px-6 py-4 border-b border-gray-200 ">
              <Link
                className="text-xl font-bold text-[#9bd32c]"
                to={navRoutes.home}
              >
                Gemspot
              </Link>
              <div className="text-sm flex items-center gap-2 text-gray-700 mt-2">
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
          </aside>

          <main className="p-6">
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1">
                {location.pathname === navRoutes.dashboard && (
                  <h1 className="text-3xl font-bold tracking-tight">
                    Overview
                  </h1>
                )}
              </div>
              <ButtonOutline text="Disconnect Wallet" onClick={disconnect} />
            </div>

            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
