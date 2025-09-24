import { createContext, useContext, useState, type ReactNode } from 'react';


export interface Bid {
  ref_num: string;
  category: string;
  amount: number;
  status: 'Ongoing' | 'Ended' | 'Outbid' | 'Top Bid';
  created_at: string; 
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
  // This state will hold the user's personal bid history.
  // For now, it's empty, but it can be populated from an API call.
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);

  return (
    <BidHistoryContext.Provider value={{ bidHistory }}>
      {children}
    </BidHistoryContext.Provider>
  );
};
