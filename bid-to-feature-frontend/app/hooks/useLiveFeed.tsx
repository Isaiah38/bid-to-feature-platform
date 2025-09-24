import {
  createContext,
  useContext,
  useState,
  useEffect,
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

interface LiveFeedContextType {
  feedEvents: LiveFeedEvent[];
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
  const { addNotification } = useNotification();

  useEffect(() => {
    const socket: Socket = io('ws://localhost:3000');

    socket.on('connect', () => {
      console.log('Live Feed WebSocket connected');
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
        id: new Date().getTime().toString(),
        message: notification.message,
        isTopBid: notification.isTopBid || false,
        timestamp: new Date().toISOString(),
      };

      setFeedEvents((prevEvents) => [newFeedEvent, ...prevEvents]);
    });

    socket.on('disconnect', () => {
      console.log('Live Feed WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [addNotification]);

  return (
    <LiveFeedContext.Provider value={{ feedEvents }}>
      {children}
    </LiveFeedContext.Provider>
  );
};
