import { Link } from 'react-router';
import { useLiveFeed } from '~/hooks/useLiveFeed';
import { LuExternalLink } from 'react-icons/lu';
import { navRoutes } from '~/utils/constants';

export const NotificationDisplay = () => {
  const { feedEvents } = useLiveFeed();

  return (
    <div className="border border-slate-200 p-4 mt-8 rounded-xl bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-sans text-black">
          Live Bidding Activity
        </h2>
        <Link
          to={navRoutes.fullBidHistory}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          View All History <LuExternalLink />
        </Link>
      </div>

      <p className="text-sm text-gray-400 my-4">
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
      </div>
    </div>
  );
};
