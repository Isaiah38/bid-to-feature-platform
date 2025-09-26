import React from 'react';
import Confetti from 'react-confetti';

interface WinnerModalProps {
  winner: {
    pubkey: string;
    amount: number;
  };
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-8 text-center"
        style={{
          backgroundImage: 'url("https://www.svgrepo.com/show/448244/trophy.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti />
        <h2 className="text-2xl font-bold mb-4">Bidding Ended!</h2>
        <p className="text-lg">The winner is:</p>
        <p className="text-xl font-bold text-yellow-500">{winner.pubkey}</p>
        <p className="text-lg">with a bid of</p>
        <p className="text-xl font-bold text-yellow-500">{winner.amount} SOL</p>
      </div>
    </div>
  );
};

export default WinnerModal;
