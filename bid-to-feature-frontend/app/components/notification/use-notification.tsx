import { createContext, useContext, useState } from 'react';
import type { ReactNode, FC } from 'react';
import type { Notification, NotificationType } from './Toast';

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function addNotification(message: string, type: NotificationType, duration: number = 5000) {
    const id = `${new Date().getTime()}`;
    const newNotification: Notification = { id, message, type, duration };
    setNotifications(currentNotifications => [...currentNotifications, newNotification]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  function removeNotification(id: string) {
    setNotifications(currentNotifications => currentNotifications.filter(notification => notification.id !== id));
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
