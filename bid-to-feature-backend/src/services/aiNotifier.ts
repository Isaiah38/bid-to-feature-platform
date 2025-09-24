// src/services/aiNotifier.ts

export enum NotificationType {
  Start = 'Start',
  MidDay = 'Mid-day',
  End = 'End',
  NewTopBid = 'NewTopBid',
  NewBidActivity = 'NewBidActivity',
}

export const generateNotification = (type: NotificationType, data: any): string => {
  const bidderShort = data.bidder ? `${data.bidder.slice(0, 4)}...${data.bidder.slice(-4)}` : 'Someone';
  const amountFormatted = data.amount ? parseFloat(data.amount).toFixed(2) : 'a certain amount';

  switch (type) {
    case NotificationType.Start:
      return `🚀 Bidding has started! Place your bid now.`;
    case NotificationType.MidDay:
      return `⏳ Bidding is halfway through! Don't miss out.`;
    case NotificationType.End:
      return `🔔 Bidding is ending soon! Last chance to bid.`;
    case NotificationType.NewTopBid:
      return `🏆 New Top Bid! ${bidderShort} is now in the lead with ${amountFormatted} SOL.`;
    case NotificationType.NewBidActivity:
      return `⚡️ New Bid! ${bidderShort} just placed a bid of ${amountFormatted} SOL.`;
    default:
      return 'New event received.';
  }
};
