import { useState } from "react";
import { MdContentCopy, MdCheck } from "react-icons/md";

interface CopyProps {
  text: string; // text to copy
}

export default function CopyToClipBoard({ text }: CopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2  rounded-lg  cursor-pointer transition"
    >
      {copied ? (
        <div className="relative">
          <MdCheck className="text-green-600" />
          {/* <span className="text-green-600">Copied!</span> */}

          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow">
            Copied!
          </div>
        </div>
      ) : (
        <>
          <MdContentCopy className="text-gray-600" />
        </>
      )}
    </button>
  );
}
