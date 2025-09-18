import { useEffect, useState } from "react";
import { Button, NavBtnOutline } from "./button";
import { navRoutes } from "~/utils/constants";
import { LuMenu, LuX } from "react-icons/lu";
import { Link } from "react-router";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const closeNav = () => setMobileOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <div
      className={`sticky top-0 z-50 bg-black ${
        scrollY > 10 ? "bg-black/70 shadow-md" : ""
      }`}
    >
      <div className="p-4  backdrop-blur-xl text-black flex justify-between items-center max-w-[1400px] mx-auto w-[95%] relative">
        {/* Logo */}
        <Link className="text-xl font-bold text-[#9bd32c]" to={navRoutes.home}>
          Gemspot
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-gray-200 hover:text-[#9bd32c] px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:block">
          <div className="flex gap-4 items-center">
            {!publicKey ? (
              <Button text="Connect Wallet" onClick={() => setVisible(true)} />
            ) : (
              <div className="flex gap-4 items-center">
                <NavBtnOutline text="Dashboard" url={navRoutes.dashboard} />
                <Button text="Disconnect Wallet" onClick={disconnect} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <LuX /> : <LuMenu />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeNav}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 ">
          <span className="font-bold text-[#9bd32c]">Gemspot</span>
          <button
            onClick={closeNav}
            className="p-2 rounded-md hover:bg-gray-100  "
            aria-label="Close navigation"
          >
            <LuX className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={closeNav}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 mt-4">
            {!publicKey ? (
              <Button text="Connect Wallet" onClick={() => setVisible(true)} className="py-3" />
            ) : (
              <div className="">
                <NavBtnOutline text="Dashboard" url={navRoutes.dashboard} className="py-3"/>
                <Button
                  text="Disconnect Wallet"
                  onClick={disconnect}
                  className="mt-4 py-3"
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};
