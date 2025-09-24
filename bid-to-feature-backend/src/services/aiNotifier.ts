// src/services/aiNotifier.ts

export enum NotificationType {
  Start = 'Start',
  MidDay = 'Mid-day',
  End = 'End',
  NewBid = 'NewBid',
}

export const generateNotification = (type: NotificationType, data: any): string => {
  switch (type) {
    case NotificationType.Start:
      return `🚀 Bidding has started! Place your bid now.`;
    case NotificationType.MidDay:
      return `⏳ Bidding is halfway through! Don't miss out.`;
    case NotificationType.End:
      return `🔔 Bidding is ending soon! Last chance to bid.`;
    case NotificationType.NewBid:
      return `🎉 New top bid! ${data.bidder} just bid ${parseFloat(data.amount).toFixed(2)} SOL.`;
    default:
      return 'New event received.';
  }
};
