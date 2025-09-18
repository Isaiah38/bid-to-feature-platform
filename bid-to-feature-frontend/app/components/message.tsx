import { FaSearch } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";

export const NoBookings = () => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="size-20 lg:size-24 mb-6 bg-gray-200 rounded-full flex items-center justify-center">
        <FaCalendarPlus className="size-8 lg:size-12 text-gray-400" />
      </div>
      <h2 className="text-md lg:text-2xl font-bold mb-2">No bookings yet</h2>
      <p className="text-slate-400 mb-6 text-[.8rem] lg:text-[1rem]">
        It looks like you haven't had any bookings
      </p>
    </div>
  );
};

export const NoResultFound = () => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="flex flex-col items-center rounded-full mb-2 border border-slate-200 p-4 bg-slate-100">
        <FaSearch className="text-slate-400 text-[2rem]" />
      </div>

      <h2 className="text-md lg:text-xl text-slate-400 mb-2">
        No result found
      </h2>
    </div>
  );
};

export const NoMessagesFound = () => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="flex flex-col items-center rounded-full mb-2 border border-slate-200 p-4 bg-slate-100">
        <LuMail className="text-slate-400 text-[1.5rem]" />
      </div>

      <h2 className="text-md  text-slate-400 mb-2">No messages yet</h2>
    </div>
  );
};
