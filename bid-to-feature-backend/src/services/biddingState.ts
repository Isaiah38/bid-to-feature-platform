// A simple in-memory store for the bidding state.
// In a production environment, you might replace this with a database like Redis.

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
