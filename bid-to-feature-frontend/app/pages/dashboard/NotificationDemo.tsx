import { useNotification } from '~/components/notification/use-notification';

export const NotificationDemo = () => {
  const { addNotification } = useNotification();

  return (
    <div className="border border-slate-200 p-4 mt-8 rounded-xl bg-white">
      <h2 className="text-xl font-bold font-sans text-black pb-4">
        Notification Demo
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Click these buttons to simulate the off-chain notification service.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() =>
            addNotification(
              'Bid for portfolio space has started! Place your bids now',
              'info'
            )
          }
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Trigger "Start" Notification
        </button>
        <button
          onClick={() =>
            addNotification(
              'Current highest bid is 12.5 SOL. Your last bid was 10 SOL. Increase to stay in the game.',
              'warning'
            )
          }
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 cursor-pointer"
        >
          Trigger "Mid-day" Notification
        </button>
        <button
          onClick={() =>
            addNotification(
              'Bid closes in 30 mins. Don’t miss out—submit your final bid.',
              'error'
            )
          }
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer"
        >
          Trigger "End" Notification
        </button>
      </div>
    </div>
  );
};
