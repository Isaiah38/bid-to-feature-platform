import DashboardPage from "~/pages/dashboard/page";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | Gemspot" },
    { name: "description", content: " " },
  ];
}

export default function Dashboard() {
  return <DashboardPage />;
}
