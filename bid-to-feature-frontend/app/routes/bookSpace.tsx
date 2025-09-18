import BookSpacePage from "~/pages/bookSpace";
import type { Route } from "./+types/bookSpace";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Book Space | Gemspot" },
    { name: "description", content: " " },
  ];
}

export default function Dashboard() {
  return <BookSpacePage />;
}
