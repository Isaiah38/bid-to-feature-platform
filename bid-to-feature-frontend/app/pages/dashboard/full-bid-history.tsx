import { useBidHistory } from '~/hooks/useBidHistory';

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
                className="p-2 rounded-md flex items-center bg-slate-50"
              >
                <span className="font-bold">{bid.bidder}</span>
                <span className="ml-2">bid</span>
                <span className="font-bold ml-1">{bid.amount} SOL</span>
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(bid.timestamp).toLocaleString()}
                </span>
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
