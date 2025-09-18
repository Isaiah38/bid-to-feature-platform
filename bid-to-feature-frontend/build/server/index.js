import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
import { LuMenu, LuX, LuMail, LuMapPin, LuPhone, LuTrendingUp, LuDollarSign } from "react-icons/lu";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Button = ({ text, onClick, className = "" }) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: `bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition cursor-pointer ${className}`,
      type: "submit",
      children: text
    }
  );
};
const ButtonOuline = ({
  text,
  onClick,
  className = ""
}) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: `border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 hover:border-teal-600 duration-100 transition cursor-pointer ${className}`,
      type: "submit",
      children: text
    }
  );
};
const navRoutes = {
  home: "/"
};
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const closeNav = () => setMobileOpen(false);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [
    { name: "Home", href: "#" },
    { name: "Investment Opportunities", href: "#" },
    { name: "Construction Management", href: "#" },
    { name: "Contact", href: "#" }
  ];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `sticky top-0 z-50 bg-white ${scrollY > 10 ? "shadow-md" : ""}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white text-black flex justify-between items-center max-w-[1400px] mx-auto w-[95%] relative", children: [
          /* @__PURE__ */ jsx(Link, { className: "text-xl font-bold text-teal-600", to: navRoutes.home, children: "Neprivateequity" }),
          /* @__PURE__ */ jsx("nav", { className: "hidden md:flex space-x-8", children: navItems.map((item) => /* @__PURE__ */ jsx(
            Link,
            {
              to: item.href,
              className: "text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium",
              children: item.name
            }
          )) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
            /* @__PURE__ */ jsx(ButtonOuline, { text: "Sign In" }),
            /* @__PURE__ */ jsx(Button, { text: "Sign Up" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsx(
            "button",
            {
              className: "text-black text-2xl",
              onClick: () => setMobileOpen(!mobileOpen),
              children: /* @__PURE__ */ jsx(LuMenu, {})
            }
          ) })
        ] }),
        mobileOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition duration-700",
              onClick: closeNav
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [
                  /* @__PURE__ */ jsx("span", {}),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: closeNav,
                      className: "p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "aria-label": "Close navigation",
                      children: /* @__PURE__ */ jsx(LuX, { className: "h-5 w-5 text-gray-600" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("nav", { className: "p-4", children: /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: navItems.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: item.href,
                    onClick: closeNav,
                    className: "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors",
                    children: /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.name })
                  }
                ) }, item.name)) }) })
              ]
            }
          )
        ] })
      ]
    }
  );
};
const City = "/assets/city-CvNKMJPm.jpg";
const Building1 = "/assets/building-1-DawngIRj.avif";
const Building2 = "/assets/building-2-nVHYJWnC.avif";
const asset = {
  image: {
    City,
    Building1,
    Building2
  }
};
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-gray-900  text-gray-400", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "text-xl font-bold text-teal-600",
            to: navRoutes.home,
            children: "Neprivateequity"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-sm mt-4", children: [
          /* @__PURE__ */ jsx("p", { children: "Construction Management, Real Estate Development " }),
          /* @__PURE__ */ jsx("p", { children: "& Investment Services." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4 text-white", children: "Company" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "#",
                className: "flex items-center text-sm hover:text-teal-600 transition-colors duration-100",
                children: "Investment Opportunities"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "#",
                className: "flex items-center text-sm hover:text-teal-600 transition-colors duration-100",
                children: "What we offer"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "#",
                className: "flex items-center text-sm hover:text-teal-600 transition-colors duration-100",
                children: "Construction Management"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4 text-white", children: "Contact" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-380", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "#",
                className: "flex items-center text-sm mt-4 hover:text-teal-600 transition-colors duration-100",
                children: [
                  /* @__PURE__ */ jsx(LuMail, { className: "w-4 h-4 mr-2 shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "glenn@newenglandbldr.com" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "#",
                className: "flex items-center text-sm mt-4 hover:text-teal-600 transition-colors duration-100",
                children: [
                  /* @__PURE__ */ jsx(LuMapPin, { className: "w-4 h-4 mr-2 shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "800 Flanders Road Building 12-2 Mystic, CT 06355" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "#",
                className: "flex items-center text-sm mt-4 hover:text-teal-600 transition-colors duration-100",
                children: [
                  /* @__PURE__ */ jsx(LuPhone, { className: "w-4 h-4 mr-2 shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "860 501 1547" })
                ]
              }
            ) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-800 mt-8 pt-6", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row justify-between items-center", children: /* @__PURE__ */ jsx("div", { className: "text-xs lg:text-sm text-gray-500 mb-4 md:mb-0", children: "© 2025 Neprivateequity. All rights reserved" }) }) })
  ] }) });
}
const index = UNSAFE_withComponentProps(function AppLayout() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Footer, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index
}, Symbol.toStringTag, { value: "Module" }));
function NewsLetter() {
  return /* @__PURE__ */ jsxs("section", { className: "mt-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6", children: /* @__PURE__ */ jsx(LuMail, { className: "w-8 h-8 text-emerald-600" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Subscribe to our newsletter" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Get exclusive real estate investment insights, market analysis, and deal opportunities delivered straight to your inbox every week." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto", children: /* @__PURE__ */ jsxs("form", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          placeholder: "Enter your email address",
          className: " w-full border  p-2 rounded text-black flex-1 h-12 px-4 border-gray-500 focus:border-emerald-500 focus:ring-emerald-500",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          text: "Subscribe",
          className: "h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        }
      )
    ] }) })
  ] });
}
const OfferingCard = ({ offering }) => {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300  overflow-hidden cursor-pointer relative", children: [
    offering.status && /* @__PURE__ */ jsx(
      "span",
      {
        className: `absolute top-3 left-3 text-xs px-2 py-1 rounded font-medium ${offering.status === "Open" ? "bg-teal-600 text-white" : offering.status === "Closed" ? "bg-gray-400 text-white" : "bg-yellow-500 text-white"}`,
        children: offering.status
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "relative h-48 overflow-hidden", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: offering.image || "",
        alt: `Image of ${offering.title}`,
        className: "object-cover w-full h-full transition-transform duration-300"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: offering.title }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-gray-500 space-y-1", children: [
        offering.location && /* @__PURE__ */ jsxs("p", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full group-hover:bg-teal-50 transition-colors duration-200", children: /* @__PURE__ */ jsx(LuMapPin, { className: "w-4 h-4 shrink-0 text-gray-500 group-hover:text-teal-600" }) }),
          " ",
          offering.location
        ] }),
        offering.returnRate && /* @__PURE__ */ jsxs("p", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-full", children: /* @__PURE__ */ jsx(LuTrendingUp, { className: "w-4 h-4 shrink-0 text-emerald-600" }) }),
          "Expected Return: ",
          offering.returnRate,
          "% annually"
        ] }),
        offering.minimumInvestment && /* @__PURE__ */ jsxs("p", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full", children: /* @__PURE__ */ jsx(LuDollarSign, { className: "w-4 h-4 shrink-0 text-teal-600" }) }),
          " ",
          "Min Investment:",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "text-gray-700 font-medium", children: [
            "$",
            offering.minimumInvestment.toLocaleString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("div", { className: "text-teal-600 font-semibold text-sm", children: "View Opportunity →" }) })
    ] })
  ] });
};
function Offerings() {
  const offerings = [
    {
      title: "Riverside Modern Duplex",
      description: "A newly constructed duplex located in a high-demand rental area with projected annual returns of 12%.",
      image: asset.image.City,
      location: "Austin, TX",
      returnRate: 12,
      minimumInvestment: 1e4,
      status: "Open"
    },
    {
      title: "Greenview Townhomes",
      description: "Energy-efficient townhomes in a growing suburb. Pre-leased units with long-term rental income potential.",
      image: asset.image.Building2,
      location: "Denver, CO",
      returnRate: 10,
      minimumInvestment: 8e3,
      status: "Open"
    },
    {
      title: "Downtown Renovation Project",
      description: "Historic property renovation in the city core. Value-add opportunity with strong equity upside.",
      image: asset.image.City,
      location: "Philadelphia, PA",
      returnRate: 14,
      minimumInvestment: 15e3,
      status: "Upcoming"
    },
    {
      title: "Lakefront Luxury Villa",
      description: "Premium vacation property with high short-term rental yield. Located in a popular tourist destination.",
      image: asset.image.Building2,
      location: "Lake Tahoe, CA",
      returnRate: 11,
      minimumInvestment: 2e4,
      status: "Open"
    },
    {
      title: "Suburban Single-Family Homes",
      description: "Portfolio of detached homes in a stable neighborhood. Fully managed with consistent returns.",
      image: asset.image.City,
      location: "Charlotte, NC",
      returnRate: 9,
      minimumInvestment: 7e3,
      status: "Closed"
    },
    {
      title: "Multi-Family Development – Phase 2",
      description: "Participate in the second phase of a profitable multifamily housing project with scalable returns.",
      image: asset.image.Building2,
      location: "Nashville, TN",
      returnRate: 13,
      minimumInvestment: 12e3,
      status: "Open"
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: offerings.map((offering, index2) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(OfferingCard, { offering }) }, index2)) });
}
function HomePage() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-white", children: /* @__PURE__ */ jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 justify-between ", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6", children: [
          "Begin Your",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "Real Estate Investment" }),
          " ",
          "Journey Now"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 mb-8", children: "Explore premium property opportunities with strong returns and expert guidance." }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-4 mb-8", children: /* @__PURE__ */ jsx(Button, { text: "Get Started" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative flex justify-end", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: asset.image.City,
          alt: "Modern city skyline with tall buildings",
          className: " w-full lg:w-[80%]  rounded-xl shadow-lg h-[400px] object-cover"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxs(
          "svg",
          {
            className: "w-8 h-8 text-teal-600",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: [
              /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Growth Area Research" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "We target emerging property hotspots backed by infrastructure and rising demand." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-8 h-8 text-teal-600",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Weekly Market Insights" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Get expert reports on property price trends, rental demand shifts, and economic factors affecting real estate." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-8 h-8 text-teal-600",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Risk-Free Investments" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "We guide you toward low-risk, high-return properties, ensuring sustainable long-term growth." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: " mt-16 space-y-16", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold text-3xl md:text-4xl text-black", children: "Investment Opportunities" }),
        /* @__PURE__ */ jsx("p", { className: "text-md text-gray-600", children: "Empowering your investment portfolio" })
      ] }),
      /* @__PURE__ */ jsx(Offerings, {})
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mt-16", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-16 ", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h2", { className: "text-black font-bold text-3xl md:text-4xl leading-10", children: [
          "Invest with Transparency, ",
          /* @__PURE__ */ jsx("br", {}),
          " Move Forward with Trust."
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-md text-slate-500 leading-8", children: "we offer real estate investment opportunities for accredited investors, with the potential for double-digit returns backed by real estate." }),
        /* @__PURE__ */ jsx(ButtonOuline, { text: "View Our Projects" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: asset.image.Building1,
          alt: "",
          className: "w-full h-[400px] object-cover rounded-lg"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(NewsLetter, {})
  ] }) });
}
function meta({}) {
  return [{
    title: "Home | Neprivateequity"
  }, {
    name: "description",
    content: " "
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(HomePage, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-H7myN4X5.js", "imports": ["/assets/chunk-NL6KNZEE-Bwy4X4wm.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DAXBFSaG.js", "imports": ["/assets/chunk-NL6KNZEE-Bwy4X4wm.js"], "css": ["/assets/root-7KsGzfLw.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "components/layout/index": { "id": "components/layout/index", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DHqbbDFB.js", "imports": ["/assets/chunk-NL6KNZEE-Bwy4X4wm.js", "/assets/index-BsvCJIaU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "components/layout/index", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CJMODO2h.js", "imports": ["/assets/chunk-NL6KNZEE-Bwy4X4wm.js", "/assets/index-BsvCJIaU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-fd4f627e.js", "version": "fd4f627e", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "components/layout/index": {
    id: "components/layout/index",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/home": {
    id: "routes/home",
    parentId: "components/layout/index",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
