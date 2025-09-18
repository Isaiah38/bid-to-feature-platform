import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/index.tsx", [index("routes/home.tsx")]),
  layout("layouts/dashboard-layout.tsx", [
    ...prefix("dashboard", [
      index("routes/dashboard.tsx"),
      route("book-space", "routes/bookSpace.tsx"),
    ]),
  ]),
  route("/*", "pages/page404.tsx"),
] satisfies RouteConfig;
