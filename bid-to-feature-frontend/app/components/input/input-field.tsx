interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  name: string;
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const InputField = ({
  label,
  placeholder,
  value,
  name,
  icon,
  onChange,
  error,
}: InputFieldProps) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 border rounded-md mt-2 px-3 py-3 transition-all duration-300 ${
          error
            ? "border-red-500 focus-within:ring-red-200"
            : "border-gray-300 focus-within:ring-2 focus-within:border-gray-600"
        }`}
      >
        {icon}
        <input
          id={name}
          name={name}
          type="text"
          className="outline-none w-full text-sm text-gray-900 placeholder:text-gray-400"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
