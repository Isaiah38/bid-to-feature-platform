import { Server } from 'socket.io';
import { generateNotification, NotificationType } from './aiNotifier';
import { getBiddingState, endBidding } from './biddingState';

const startAiHeartbeat = (io: Server) => {
  const sentNotifications = {
    start: false,
    midway: false,
    endingSoon: false,
    ended: false,
  };
  console.log('🧠 AI Heartbeat service started. Monitoring auction state...');

  setInterval(async () => {
    const state = getBiddingState();
    if (!state.isBiddingActive) {
      return;
    }

    const now = Date.now();
    const totalDuration = state.auctionEndTime - state.auctionStartTime;
    const halfwayPoint = state.auctionStartTime + totalDuration / 2;
    const fiveMinutesBeforeEnd = state.auctionEndTime - 5 * 60 * 1000;

    if (!sentNotifications.start) {
      const message = await generateNotification(NotificationType.Start, {});
      io.emit('new_notification', { type: 'success', message });
      sentNotifications.start = true;
    }

    if (now >= halfwayPoint && !sentNotifications.midway) {
      const message = await generateNotification(NotificationType.MidDay, {});
      io.emit('new_notification', { type: 'info', message });
      sentNotifications.midway = true;
    }

    if (now >= fiveMinutesBeforeEnd && !sentNotifications.endingSoon) {
      const message = await generateNotification(NotificationType.End, {});
      io.emit('new_notification', { type: 'warning', message });
      sentNotifications.endingSoon = true;
    }

    if (now >= state.auctionEndTime && !sentNotifications.ended) {
      endBidding();
      const winner = state.topBidder;
      const message = await generateNotification(
        NotificationType.BiddingEnded,
        {
          bidder: winner?.pubkey,
          amount: winner?.amount,
        }
      );
      io.emit('bidding_ended', winner);
      io.emit('new_notification', { type: 'success', message });
      sentNotifications.ended = true;
    }
  }, 5000);
};

export { startAiHeartbeat };
