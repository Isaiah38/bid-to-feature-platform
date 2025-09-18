import { useEffect, useState } from "react";
import { ButtonOutline } from "~/components/button";

interface StatsDataProps {
  balance: number;
  new: number;
  read: number;
  replied: number;
}

export default function DashboardStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsDataProps>({
    balance: 0,
    new: 0,
    read: 0,
    replied: 0,
  });

  const updateDataField = (updates: Partial<StatsDataProps>) => {
    setStats((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const info = [
    {
      id: 1,
      value: stats.balance,
      label: "Sol Balance",
    },
    {
      id: 2,
      value: stats.new,
      label: "Bid Amount",
    },
  ];

  return (
    <div className="mt-4">
      <div className="grid  md:grid-cols-3 lg:grid-cols-3 gap-4">
        {info.map((item, index) => (
          <div
            key={index}
            className=" grid gap-4 px-5 py-6 shadow-sm rounded-[1rem] bg-white border border-gray-200"
          >
            <div className="flex items-center gap-4 justify-between">
              <div className="text-gray-600 font-medium text-sm">
                {item.label}
              </div>
              {item.id === 2 && (
                <ButtonOutline
                  text="Withdraw"
                  onClick={() => {}}
                  className="text-xs hover:text-black"
                />
              )}
            </div>

            <div className="">
              <h4 className="text-2xl font-bold text-black">{item.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
