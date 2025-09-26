import BidHistory from './bid-history';
import DashboardStats from './stats';
import { NotificationDisplay } from './NotificationDisplay';

export default function DashboardPage() {
  return (
    <>
      <DashboardStats />
      <BidHistory />
      <NotificationDisplay />
    </>
  );
}
