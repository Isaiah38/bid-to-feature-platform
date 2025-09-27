import { useBidHistory, BidHistoryProvider } from '~/hooks/useBidHistory';
import ClickToCopy from '~/components/ClickToCopy';
import PaginatedTable from '~/components/table/PaginatedTable';
import { format, isValid } from 'date-fns';

const BidHistoryContent = () => {
  const { bidHistory } = useBidHistory();

  const headers = ['User', 'Amount(SOL)', 'Date'];
  const data = bidHistory.map((bid) => {
    const date = new Date(bid.timestamp);
    const formattedDate = isValid(date)
      ? format(date, 'E, MMM d, yyyy, h:mm a')
      : '--';

    return [
      <ClickToCopy text={bid.bidder} />,
      <span className="font-bold">
        <span className="text-black">{bid.amount.toFixed(2)}</span> SOL
      </span>,
      <span className="text-slate-600">{formattedDate}</span>,
    ];
  });

  return (
    <div className="p-4 md:p-8">
      <div className="border border-slate-200 p-4 mt-8 rounded-xl bg-white">
        <h2 className="text-2xl font-bold font-sans text-black pb-4">
          Full Bidding History
        </h2>
        <div className="mt-4">
          {bidHistory.length > 0 ? (
            <PaginatedTable headers={headers} data={data} />
          ) : (
            <p className="text-gray-500 text-center py-8">
              No bidding history found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function FullBidHistoryPage() {
  return (
    <BidHistoryProvider>
      <BidHistoryContent />
    </BidHistoryProvider>
  );
}
