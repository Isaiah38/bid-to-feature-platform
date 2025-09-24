interface Bidder {
  pubkey: string;
  amount: number;
}

let currentTopBidder: Bidder | null = null;

export const getTopBidder = (): Bidder | null => {
  return currentTopBidder;
};

export const setTopBidder = (bidder: Bidder) => {
  currentTopBidder = bidder;
};
