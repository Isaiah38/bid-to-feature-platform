import { Server } from 'socket.io';
import { generateNotification, NotificationType } from './aiNotifier';
import { getBiddingState, setTopBidder } from './biddingState';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from './idl/smart_contract.json';
import config from '../config';

const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey('A4tegPx6662aYdJANarfVQufCwtWcELiGtR56KhogR9');

const processBidEvent = async (io: Server, newBidData: { pubkey: string, amount: number }) => {
  const { topBidder: previousTopBidder, isBiddingActive } = getBiddingState();

  if (!isBiddingActive) {
    console.log('[Logic] Ignoring new bid event: Bidding has ended.');
    return;
  }

  if (!previousTopBidder || newBidData.amount > previousTopBidder.amount) {
    setTopBidder(newBidData);
    const message = await generateNotification(NotificationType.NewTopBid, { bidder: newBidData.pubkey, amount: newBidData.amount });
    console.log(`[Logic] Emitting New Top Bid: "${message}"`);
    io.emit('new_notification', { type: 'info', message, isTopBid: true });
  } else {
    const message = await generateNotification(NotificationType.NewBidActivity, { bidder: newBidData.pubkey, amount: newBidData.amount });
    console.log(`[Logic] Emitting New Bid Activity: "${message}"`);
    io.emit('new_notification', { type: 'info', message, isTopBid: false });
  }
};

export const listenToEvents = (io: Server) => {
  if (config.useMockListener) {
    console.log('🚀 Mock Solana event listener started.');
    setInterval(() => {
      const state = getBiddingState();
      if (!state.isBiddingActive) return;

      const currentTopAmount = state.topBidder?.amount || 10;
      const newAmount = currentTopAmount + (Math.random() * 10 - 4); 
      
      const mockEventData = {
        pubkey: `User...${Math.random().toString(36).substring(2, 7)}`,
        amount: newAmount > 0 ? newAmount : 1,
      };
      processBidEvent(io, mockEventData);
    }, 10000);
  } else {
    try {
      const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
      const provider = new AnchorProvider(connection, { signTransaction: () => Promise.reject(), signAllTransactions: () => Promise.reject(), publicKey: PublicKey.default }, {});
      const program = new Program(idl as any, PROGRAM_ID, provider);
      
      console.log('✅ Successfully connected to the Solana program. Listening for events...');

      program.addEventListener('NewTopBidders', (event, slot) => {
        console.log(`[Real Event] NewTopBidders event received at slot ${slot}:`, event);
        const topBidderEvent = event.bidders[0];
        if (!topBidderEvent) return;

        const newBidData = {
          pubkey: topBidderEvent.pubkey.toString(),
          amount: topBidderEvent.amount.toNumber() / 1_000_000_000,
        };
        processBidEvent(io, newBidData);
      });
    } catch (error) {
      console.error('❌ Failed to connect to the Solana program or listen for events:', error);
    }
  }
};
