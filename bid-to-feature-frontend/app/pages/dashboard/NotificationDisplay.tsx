import { Link } from 'react-router';
import { useLiveFeed } from '~/hooks/useLiveFeed';

export const NotificationDisplay = () => {
  const { feedEvents } = useLiveFeed();

  return (
    <div className="border border-slate-200 p-4 mt-8 rounded-xl bg-white">
      <h2 className="text-xl font-bold font-sans text-black pb-4">
        Live Bidding Activity
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Watching for on-chain events... New bid notifications will appear here in real-time.
      </p>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <h3 className="text-lg font-semibold text-black">Recent Bids</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          {feedEvents.length > 0 ? (
            feedEvents.slice(0, 5).map((event) => (
              <li 
                key={event.id} 
                className={`p-2 rounded-md flex items-center ${event.isTopBid ? 'bg-yellow-100' : 'bg-slate-50'}`}
              >
                {event.message}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No new bids yet...</p>
          )}
        </ul>
        {feedEvents.length > 5 && (
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
