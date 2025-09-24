import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import io, { Socket } from 'socket.io-client';

// This interface should match the actual data structure from your backend
export interface Bid {
  ref_num: string;
  category: string;
  amount: number;
  status: 'Ongoing' | 'Ended' | 'Outbid' | 'Top Bid';
  created_at: string; // ISO date string
  isTopBid: boolean;
  message?: string; // Optional message for notifications
}

interface BidHistoryContextType {
  bidHistory: Bid[];
  addBid: (bid: Bid) => void;
}

const BidHistoryContext = createContext<BidHistoryContextType | undefined>(undefined);

export const useBidHistory = () => {
  const context = useContext(BidHistoryContext);
  if (!context) {
    throw new Error('useBidHistory must be used within a BidHistoryProvider');
  }
  return context;
};

export const BidHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const { publicKey } = useWallet();

  useEffect(() => {
    const socket: Socket = io('ws://localhost:3000', {
      query: {
        ...(publicKey && { walletId: publicKey.toBase58() }),
      },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      socket.emit('request-bid-history');
    });

    socket.on('bid-history', (history: Bid[]) => {
      setBidHistory(history);
    });

    socket.on('new-bid', (newBid: Bid) => {
      addBid(newBid);
    });
    
    socket.on('notification', (notification: any) => {
      // Adapt the notification to the Bid structure
      const adaptedNotification: Bid = {
        ref_num: new Date().getTime().toString(), // Create a temporary ref
        category: 'Notification',
        amount: notification.amount || 0,
        status: 'Ongoing',
        created_at: new Date().toISOString(),
        isTopBid: notification.isTopBid || false,
        message: notification.message,
      };
      addBid(adaptedNotification);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [publicKey]);

  const addBid = (newBid: Bid) => {
    setBidHistory(prevHistory => {
      const updatedHistory = newBid.isTopBid
        ? prevHistory.map(bid => ({ ...bid, status: 'Outbid' as const, isTopBid: false }))
        : prevHistory;
      
      const finalBid = {
        ...newBid,
        status: newBid.isTopBid ? ('Top Bid' as const) : newBid.status,
      };

      return [finalBid, ...updatedHistory];
    });
  };

  return (
    <BidHistoryContext.Provider value={{ bidHistory, addBid }}>
      {children}
    </BidHistoryContext.Provider>
  );
};
