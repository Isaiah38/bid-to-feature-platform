import React from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import useWindowSize from '~/hooks/useWindowSize';

interface WinnerModalProps {
  winner: {
    pubkey: string;
    amount: number;
  };
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  const { width, height } = useWindowSize();

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti width={width} height={height} recycle={false} />
      <motion.div
        className="bg-white rounded-lg p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl">
          🏆
        </div>
        <h2 className="text-2xl font-bold mb-4 mt-12">Bidding Ended!</h2>
        <p className="text-lg">The winner is:</p>
        <p className="text-xl font-bold text-yellow-500">
          User {winner.pubkey}
        </p>
        <p className="text-lg">with a bid of</p>
        <p className="text-xl font-bold text-yellow-500">{winner.amount} SOL</p>
      </motion.div>
    </motion.div>
  );
};

export default WinnerModal;
