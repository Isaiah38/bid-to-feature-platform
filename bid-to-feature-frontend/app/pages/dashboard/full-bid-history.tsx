import { useBidHistory } from '~/hooks/useBidHistory';
import { FaTrophy } from 'react-icons/fa';

export const FullBidHistoryPage = () => {
  const { bidHistory } = useBidHistory();

  return (
    <div className="p-4 md:p-8">
      <div className="border border-slate-200 p-4 mt-8 rounded-xl bg-white">
        <h2 className="text-xl font-bold font-sans text-black pb-4">
          Full Bidding History
        </h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          {bidHistory.length > 0 ? (
            bidHistory.map((bid, index) => (
              <li 
                key={index} 
                className={`p-2 rounded-md flex items-center ${bid.isTopBid ? 'bg-yellow-100' : 'bg-slate-50'}`}
              >
                {bid.message}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No bidding history found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};
