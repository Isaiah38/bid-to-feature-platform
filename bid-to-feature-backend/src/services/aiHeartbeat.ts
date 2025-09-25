import { Server } from 'socket.io';
import { generateNotification, NotificationType } from './aiNotifier';
import { getBiddingState, endBidding } from './biddingState';
const sentNotifications = {
  start: false,
  midway: false,
  endingSoon: false,
};

const startAiHeartbeat = (io: Server) => {
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

    // 1. Bidding Start Notification
    if (!sentNotifications.start) {
      const message = await generateNotification(NotificationType.Start, {});
      console.log(`[Heartbeat] Emitting: "${message}"`);
      io.emit('new_notification', { type: 'success', message });
      sentNotifications.start = true;
    }

    // 2. Mid-day/Halfway Notification
    if (now >= halfwayPoint && !sentNotifications.midway) {
      const message = await generateNotification(NotificationType.MidDay, {});
      console.log(`[Heartbeat] Emitting: "${message}"`);
      io.emit('new_notification', { type: 'info', message });
      sentNotifications.midway = true;
    }
    
    // 3. "Ending Soon" Notification (e.g., 5 minutes left)
    // Note: For a 5-minute auction, this will trigger almost immediately after the halfway point.
    if (now >= fiveMinutesBeforeEnd && !sentNotifications.endingSoon) {
      const message = await generateNotification(NotificationType.End, {});
      console.log(`[Heartbeat] Emitting: "${message}"`);
      io.emit('new_notification', { type: 'warning', message });
      sentNotifications.endingSoon = true;
    }

    // 4. End of Bidding
    if (now >= state.auctionEndTime) {
      endBidding();
      // Optional: could emit a final "Bidding Ended" message here.
    }
  }, 5000); // Check the state every 5 seconds
};

export { startAiHeartbeat };
