import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

type NavButtonProps = {
  text: string;
  url: string;
  icon?: ReactNode; // space for icon
  className?: string;
};

export const Button = ({
  text,
  onClick,
  className = "",
  disabled,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`bg-[#9bd32c] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#7eaa25] transition cursor-pointer ${className}`}
      type="submit"
    >
      {text}
    </button>
  );
};

export const ButtonOutline = ({
  text,
  onClick,
  className = "",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`border border-[#7eaa25] text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 hover:border-[#7eaa25] duration-100 transition cursor-pointer ${className}`}
      type="submit"
    >
      {text}
    </button>
  );
};

export const NavBtnOutline = ({
  text,
  url,
  className = "",
}: NavButtonProps) => {
  return (
    <Link
      to={url}
      className={`border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 hover:border-[#7eaa25] duration-100 transition cursor-pointer ${className}`}
      type="submit"
    >
      {text}
    </Link>
  );
};

export const DashboardNavBtn = ({
  text,
  url,
  icon,
  className = "",
}: NavButtonProps) => {
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <Link
      to={url}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition duration-200
        ${
          isActive
            ? "bg-[#7eaa25] text-white border border-[#7eaa25]"
            : "border border-transparent text-black  hover:border-[#7eaa25]"
        } 
        ${className}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </Link>
  );
};
