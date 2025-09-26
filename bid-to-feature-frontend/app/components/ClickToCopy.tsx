import { useState } from 'react';
import { LuCopy, LuCheck } from 'react-icons/lu';

interface ClickToCopyProps {
  text: string;
}

export default function ClickToCopy({ text }: ClickToCopyProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const shortText = `${text.slice(0, 8)}...${text.slice(-8)}`;

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 font-mono transition-colors duration-300 ${
        isCopied
          ? 'text-blue-600'
          : 'text-green-600 hover:text-green-700'
      }`}
      title="Click to copy full key"
    >
      {isCopied ? (
        <>
          <LuCheck />
          Copied!
        </>
      ) : (
        <>
          <LuCopy />
          {shortText}
        </>
      )}
    </button>
  );
}
