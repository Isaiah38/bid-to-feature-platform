import React, { useCallback } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import useWindowSize from '~/hooks/useWindowSize';
import Particles from 'react-particles';
import { loadFireworksPreset } from 'tsparticles-preset-fireworks';
import type { Engine } from 'tsparticles-engine';

interface WinnerModalProps {
  winner: {
    pubkey: string;
    amount: number;
  };
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  const { width, height } = useWindowSize();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFireworksPreset(engine);
  }, []);

  const particlesOptions = {
    preset: 'fireworks',
    background: {
      color: {
        value: 'transparent',
      },
    },
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    emitters: {
      rate: {
        delay: 0.15,
        quantity: 5,
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <Confetti width={width} height={height} />
      <motion.div
        className="bg-white rounded-lg p-8 text-center relative z-10"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl">
          🏆
        </div>
        <h2 className="text-8xl text-green-500 font-bold mb-4 mt-12">
          WINNER!!!
        </h2>
        <p className="text-lg text-black">The winner is:</p>
        <p className="text-xl font-bold text-yellow-500">
          User {winner.pubkey}
        </p>
        <p className="text-lg text-black">with a bid of</p>
        <p className="text-xl font-bold text-yellow-500">{winner.amount} SOL</p>
      </motion.div>
    </motion.div>
  );
};

export default WinnerModal;
