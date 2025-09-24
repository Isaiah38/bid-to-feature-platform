import BidHistory from './bid-history';
import DashboardStats from './stats';
import { NotificationDemo } from './NotificationDemo';

export default function DashboardPage() {
  return (
    <>
      <DashboardStats />
      <BidHistory />
      <NotificationDemo />
    </>
  );
}
