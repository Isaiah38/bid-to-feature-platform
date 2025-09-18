import type { Route } from "./+types/home";
import HomePage from "~/pages/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Gemspot" },
    { name: "description", content: " " },
  ];
}

export default function Home() {
  return <HomePage />;
}
