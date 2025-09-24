import { Server } from 'socket.io';
import { generateNotification, NotificationType } from './aiNotifier';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from './idl/smart_contract.json';

// --- Configuration ---
// Set this to `true` to use the mock data simulator.
// Set this to `false` to connect to the actual Solana network.
const USE_MOCK_LISTENER = true;
// -------------------

const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey('A4tegPx6662aYdJANarfVQufCwtWcELiGtR56KhqogR9');

export const listenToEvents = (io: Server) => {
  if (USE_MOCK_LISTENER) {
    // --- MOCK IMPLEMENTATION ---
    console.log('🚀 Mock Solana event listener started. (Set USE_MOCK_LISTENER to false to use the real one)');
    setInterval(() => {
      const mockEventData = {
        bidder: `User...${Math.random().toString(36).substring(2, 7)}`,
        amount: Math.random() * 20 + 1,
      };
      const message = generateNotification(NotificationType.NewBid, mockEventData);
      console.log(`[Mock Event] Emitting notification: "${message}"`);
      io.emit('new_notification', {
        type: 'info',
        message: message,
      });
    }, 15000);
    // --- END OF MOCK IMPLEMENTATION ---

  } else {
    // --- REAL IMPLEMENTATION ---
    try {
      const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
      const provider = new AnchorProvider(connection, { signTransaction: () => Promise.reject(), signAllTransactions: () => Promise.reject(), publicKey: PublicKey.default }, {});
      const program = new Program(idl as any, PROGRAM_ID, provider);
      
      console.log('✅ Successfully connected to the Solana program. Listening for events...');

      program.addEventListener('NewTopBidders', (event, slot) => {
        console.log(`[Real Event] NewTopBidders event received at slot ${slot}:`, event);
        const topBidder = event.bidders[0];
        if (!topBidder) return;

        const eventData = {
          bidder: topBidder.pubkey.toString(),
          amount: topBidder.amount.toNumber() / 1_000_000_000,
        };

        const message = generateNotification(NotificationType.NewBid, eventData);
        console.log(`[Real Event] Emitting notification: "${message}"`);
        io.emit('new_notification', {
          type: 'info',
          message: message,
        });
      });

    } catch (error) {
      console.error('❌ Failed to connect to the Solana program or listen for events:', error);
    }
    // --- END OF REAL IMPLEMENTATION ---
  }
};
