import { useEffect, useState } from 'react';
import { StatusBadge } from '~/components/badge/status';
import SectionLoaderLayout from '~/components/loader/section/layout';
import { NoResultFound } from '~/components/message';
import { LoadingState } from '~/utils/enum';
import { format } from 'date-fns';
import { ButtonOutline } from '~/components/button';
import IncreaseBid from './increaseBid';
import { fi } from 'date-fns/locale';

const generateRefNum = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function BidHistory() {
  const [isLoading, setIsLoading] = useState<LoadingState>(
    LoadingState.LOADING
  );
  const [items, setItems] = useState<any[]>([]);

  const getBidHistory = async () => {
    try {
      setIsLoading(LoadingState.LOADING);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dummyData = [
        {
          ref_num: generateRefNum(),
          category: 'Business',
          amount: 2.5,
          status: 'Ongoing',
          created_at: '2025-09-15T10:30:00Z',
        },
        {
          ref_num: generateRefNum(),
          category: 'Business',
          amount: 3,
          status: 'Ongoing',
          created_at: '2025-09-15T10:30:00Z',
        },
        {
          ref_num: generateRefNum(),
          category: 'Business',
          amount: 4.5,
          status: 'Ended',
          created_at: '2025-09-15T10:30:00Z',
        },
      ];

      setItems(dummyData);
      // setIsLoading(LoadingState.RESOLVED);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(LoadingState.RESOLVED);
    }
  };

  useEffect(() => {
    getBidHistory();
  }, []);

  return (
    <div className="border border-slate-200 p-4 mt-8 rounded-xl bg-white">
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold font-sans text-black">Bid History</p>
      </div>

      <div className="p-2 lg:p-4">
        {/* Desktop Header */}
        <div className="hidden lg:grid lg:grid-cols-6 p-2 text-sm bg-slate-50 rounded-md mt-4">
          <div className="text-gray-500 font-medium">Ref</div>
          <div className="text-gray-500 font-medium">Category</div>
          <div className="text-gray-500 font-medium">Amount (SOL)</div>
          <div className="text-gray-500 font-medium">Status</div>
          <div className="text-gray-500 font-medium">Date</div>
          <div className="text-gray-500 font-medium">Action</div>
        </div>

        <SectionLoaderLayout isLoading={isLoading === LoadingState.LOADING}>
          {items.length === 0 && (
            <div className="mt-8">
              <NoResultFound />
            </div>
          )}

          {items.length > 0 && (
            <div>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-slate-100 py-3 flex flex-col lg:grid lg:grid-cols-6 lg:gap-2 text-sm"
                >
                  {/* Mobile layout: show labels */}
                  <div className="flex justify-between lg:block">
                    <span className="lg:hidden text-gray-400">Bid ID:</span>
                    <p className="text-slate-800 font-medium truncate">
                      {item.ref_num}
                    </p>
                  </div>

                  <div className="flex justify-between lg:block">
                    <span className="lg:hidden text-gray-400">Category:</span>
                    <p className="text-slate-600">{item.category}</p>
                  </div>

                  <div className="flex justify-between lg:block">
                    <span className="lg:hidden text-gray-400">Amount:</span>
                    <p className="text-black font-bold">{item.amount}</p>
                  </div>

                  <div className="flex justify-between lg:block">
                    <span className="lg:hidden text-gray-400">Status:</span>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex justify-between lg:block">
                    <span className="lg:hidden text-gray-400">Date:</span>
                    <p className="text-slate-600">
                      {format(new Date(item.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div className="flex justify-end lg:justify-start mt-2 lg:mt-0">
                    <IncreaseBid />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionLoaderLayout>
      </div>
    </div>
  );
}
