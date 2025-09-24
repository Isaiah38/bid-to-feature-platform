import BidHistory from './bid-history';
import DashboardStats from './stats';
import { NotificationDisplay } from './NotificationDisplay';
import { LiveFeedProvider } from '~/hooks/useLiveFeed';

export default function DashboardPage() {
  return (
    <LiveFeedProvider>
      <DashboardStats />
      <BidHistory />
      <NotificationDisplay />
    </LiveFeedProvider>
  );
}
