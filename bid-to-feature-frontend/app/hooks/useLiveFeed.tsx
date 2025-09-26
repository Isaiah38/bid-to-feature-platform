import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useId,
  type ReactNode,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { useNotification } from '~/components/notification/use-notification';
import type { NotificationType } from '~/components/notification/Toast';

export interface LiveFeedEvent {
  id: string;
  message: string;
  isTopBid: boolean;
  timestamp: string;
}

interface Winner {
  pubkey: string;
  amount: number;
}

interface LiveFeedContextType {
  feedEvents: LiveFeedEvent[];
  winner: Winner | null;
}

const LiveFeedContext = createContext<LiveFeedContextType | undefined>(
  undefined
);

export const useLiveFeed = () => {
  const context = useContext(LiveFeedContext);
  if (!context) {
    throw new Error('useLiveFeed must be used within a LiveFeedProvider');
  }
  return context;
};

export const LiveFeedProvider = ({ children }: { children: ReactNode }) => {
  const [feedEvents, setFeedEvents] = useState<LiveFeedEvent[]>([]);
  const [winner, setWinner] = useState<Winner | null>(null);
  const { addNotification } = useNotification();
  const eventCounter = useRef(0);
  const idPrefix = useId();

  useEffect(() => {
    const socket: Socket = io('ws://localhost:3000');

    socket.on('connect', () => {
      console.log('Live Feed WebSocket connected');
    });

    socket.on('bidding_ended', (data: { winner: Winner }) => {
      setWinner(data.winner);
    });

    socket.on('new_notification', (notification: any) => {
      const validTypes: NotificationType[] = [
        'info',
        'success',
        'warning',
        'error',
      ];
      const notificationType = (notification.type?.toLowerCase() ||
        'info') as NotificationType;
      const type = validTypes.includes(notificationType)
        ? notificationType
        : 'info';

      addNotification(notification.message, type);

      const newFeedEvent: LiveFeedEvent = {
        id: `${idPrefix}-${eventCounter.current++}`,
        message: notification.message,
        isTopBid: notification.isTopBid || false,
        timestamp: new Date().toISOString(),
      };

      setFeedEvents((prevEvents) => {
        let updatedEvents = [...prevEvents];

        if (newFeedEvent.isTopBid) {
          updatedEvents = updatedEvents.map((event) => {
            if (event.isTopBid) {
              return {
                ...event,
                isTopBid: false,
                message: event.message.replace(
                  '🏆 New Top Bid!',
                  '⚡️ New Bid!'
                ),
              };
            }
            return event;
          });
          updatedEvents.unshift(newFeedEvent);
        } else {
          const topBidIndex = updatedEvents.findIndex(
            (event) => event.isTopBid
          );
          if (topBidIndex !== -1) {
            updatedEvents.splice(topBidIndex + 1, 0, newFeedEvent);
          } else {
            updatedEvents.unshift(newFeedEvent);
          }
        }
        return updatedEvents;
      });
    });

    socket.on('disconnect', () => {
      console.log('Live Feed WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [addNotification, idPrefix]);

  return (
    <LiveFeedContext.Provider value={{ feedEvents, winner }}>
      {children}
    </LiveFeedContext.Provider>
  );
};
