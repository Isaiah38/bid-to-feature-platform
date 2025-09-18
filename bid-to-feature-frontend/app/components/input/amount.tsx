import { useContext } from "react";
export default function InputAmount({
  name,
  formData,
  handleChange,
}: {
  title?: string;
  name: string;
  formData: any;
  handleChange: any;
  required?: boolean;
}) {
  return (
    <label htmlFor={name} className="w-full relative">
      <input
        id={name}
        type="text"
        placeholder="Enter Sol amount"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="pl-12 outline-none placeholder:font-normal placeholder:text-sm w-full font-bold text-gray-900 placeholder:text-gray-400 border-gray-400 focus-within:ring-2 focus-within:border-gray-600 border rounded-md px-3 py-3 text-xl transition-all duration-300"
      />

      <span className="absolute font-medium  left-3 -top-1 text-[15px]">
        {"SOL"}
      </span>
    </label>
  );
}
