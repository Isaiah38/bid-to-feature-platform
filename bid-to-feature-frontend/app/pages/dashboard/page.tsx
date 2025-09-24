import BidHistory from "./bid-history";
import DashboardStats from "./stats";
import { useNotification } from "../../components/notification/use-notification";

const NotificationDemo = () => {
  const { addNotification } = useNotification();

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 mt-8">
      <h2 className="text-lg font-semibold text-white mb-4">Notification Demo</h2>
      <p className="text-sm text-gray-400 mb-4">Click these buttons to simulate the off-chain notification service.</p>
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => addNotification("Bid for portfolio space has started! Place your bids now", "info")}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Trigger "Start" Notification
        </button>
        <button 
          onClick={() => addNotification("Current highest bid is 12.5 SOL. Your last bid was 10 SOL. Increase to stay in the game.", "warning")}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
        >
          Trigger "Mid-day" Notification
        </button>
        <button 
          onClick={() => addNotification("Bid closes in 30 mins. Don’t miss out—submit your final bid.", "error")}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Trigger "End" Notification
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <>
      <DashboardStats />
      <BidHistory />
      <NotificationDemo />
    </>
  );
}
