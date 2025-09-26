import config from '../config';

interface Bidder {
  pubkey: string;
  amount: number;
}

interface BiddingState {
  topBidder: Bidder | null;
  auctionStartTime: number;
  auctionEndTime: number;
  isBiddingActive: boolean;
}


const now = Date.now();

const state: BiddingState = {
  topBidder: null,
  auctionStartTime: now,
  auctionEndTime: now + config.auctionDurationMinutes * 60 * 1000,
  isBiddingActive: true,
};

export const getBiddingState = (): Readonly<BiddingState> => {
  return state;
};

export const setTopBidder = (bidder: Bidder) => {
  if (!state.topBidder || bidder.amount > state.topBidder.amount) {
    state.topBidder = bidder;
  }
};

export const endBidding = () => {
  state.isBiddingActive = false;
};
