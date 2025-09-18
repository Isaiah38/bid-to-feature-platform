import { Link } from "react-router";
import { navRoutes } from "~/utils/constants";

export default function Page404() {
  return (
    <div className="h-screen flex flex-col gap-8 justify-center items-center bg-white">
      <h1 className="text-3xl text-black font-bold">Page not found</h1>

      <Link
        to={navRoutes.home}
        className={`capitalize dm-sans text-white px-6 py-4 rounded-full font-bold bg-black/90 shadow-lg transition-all duration-300
                     hover:bg-black hover:shadow-xl hover:animate-pulse cursor-pointer
                    `}
      >
        Back to Home Page
      </Link>
    </div>
  );
}
