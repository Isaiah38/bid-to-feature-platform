import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Bid {
  bidder: string;
  amount: number;
  timestamp: number;
}

interface BidHistoryContextType {
  bidHistory: Bid[];
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/history');
        const data = await response.json();
        setBidHistory(data);
      } catch (error) {
        console.error('Failed to fetch bid history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <BidHistoryContext.Provider value={{ bidHistory }}>
      {children}
    </BidHistoryContext.Provider>
  );
};
