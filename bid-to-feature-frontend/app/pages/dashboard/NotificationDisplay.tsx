import { useEffect } from 'react';
import { Link } from 'react-router';
import { io } from 'socket.io-client';
import { useNotification } from '~/components/notification/use-notification';
import { useBidHistory } from '~/hooks/useBidHistory';

const socket = io('http://localhost:3000');

export const NotificationDisplay = () => {
  const { addNotification } = useNotification();
  const { bidHistory, addBid } = useBidHistory();

  useEffect(() => {
    const handleNewNotification = (notification: { message: string; type: 'success' | 'info' | 'warning' | 'error'; isTopBid: boolean }) => {
      addNotification(notification.message, notification.type);
      addBid({
        message: notification.message, isTopBid: notification.isTopBid,
        ref_num: '',
        category: '',
        amount: 0,
        status: 'Ongoing',
        created_at: ''
      });
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [addNotification, addBid]);

  return (
    <div className="border border-slate-200 p-4 mt-8 rounded-xl bg-white">
      <h2 className="text-xl font-bold font-sans text-black pb-4">
        Live Bidding Activity
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Watching for on-chain events... New bid notifications will appear here in real-time.
      </p>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <h3 className="text-lg font-semibold text-black">Bidding History</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          {bidHistory.length > 0 ? (
            bidHistory.slice(0, 5).map((bid, index) => (
              <li 
                key={index} 
                className={`p-2 rounded-md flex items-center ${bid.isTopBid ? 'bg-yellow-100' : 'bg-slate-50'}`}
              >
                {bid.message}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No new bids yet...</p>
          )}
        </ul>
        {bidHistory.length > 5 && (
          <div className="mt-4 text-center">
            <Link 
              to="/dashboard/full-history"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all history
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
