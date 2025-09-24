import type { FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from './Toast';
import { useNotification } from './use-notification';

export const NotificationContainer: FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {notifications.map(notification => (
            <Toast key={notification.id} {...notification} onDismiss={removeNotification} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
