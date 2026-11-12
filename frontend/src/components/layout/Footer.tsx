
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "About us",
    links: [
      { label: "About our marketplace", path: "/about" },
      { label: "Contact us", path: "/contact" },
      { label: "Careers", path: "/careers" },
      { label: "Trust & Transparency", path: "/trust" },
    ],
  },
  {
    title: "Buy",
    links: [
      { label: "How to buy", path: "/how-to-buy" },
      { label: "Collections", path: "/collections" },
      { label: "Loyalty program", path: "/loyalty" },
      { label: "Discounts", path: "/deals" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", path: "/faq" },
      { label: "How to activate a game", path: "/activation" },
      { label: "Create a ticket", path: "/support" },
      { label: "Return policy", path: "/returns" },
      { label: "Content reporting", path: "/report" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Gaming news", path: "/news" },
      { label: "Giveaways", path: "/giveaways" },
      { label: "Become affiliate", path: "/affiliate" },
      { label: "Rewards", path: "/rewards" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Sell on our marketplace", path: "/sell" },
      { label: "Advertise with us", path: "/advertise" },
    ],
  },
];

const paymentMethods = [
  "PayPal",
  "Pay Later",
  "Apple Pay",
  "Google Pay",
  "VISA",
  "Mastercard",
  "American Express",
  "Venmo",
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Newsletter backend integration will be added later.
  };

  return (
    <footer className="w-full bg-[#15092F] text-white">
      {/* PAYMENT METHODS */}
      <div className="w-full bg-white py-3 text-[#211342]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
          <span className="text-sm font-extrabold text-[#4519AC]">
            Digital Marketplace
          </span>

          {paymentMethods.map((method) => (
            <span
              key={method}
              className="text-xs font-extrabold tracking-tight sm:text-sm"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12">
        {/* FOOTER NAVIGATION */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-8">
          {footerSections.map((section) => (
            <div key={section.title} className="min-w-0">
              <h3 className="mb-4 text-sm font-bold">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-xs text-white/85 transition-colors hover:text-[#FFDD00] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="mb-4 text-sm font-bold">
              Follow us
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-colors hover:text-[#FFDD00]"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
                </svg>
              </a>

              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-[#FFDD00]"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                  />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="18"
                    cy="6"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* YOUTUBE */}
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="transition-colors hover:text-[#FFDD00]"
              >
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="4"
                  />
                  <path
                    d="m10 9 5 3-5 3z"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* GAMING COMMUNITY */}
              <span
                title="Gaming community"
                aria-label="Gaming community"
                className="text-xl"
              >
                🎮
              </span>
            </div>
          </div>

          {/* DOWNLOAD APP */}
          <div>
            <h3 className="mb-4 text-sm font-bold">
              Download the App
            </h3>

            <div className="flex flex-col gap-3">
              <span className="flex items-center justify-center rounded border border-white/60 bg-black px-3 py-2 text-xs font-semibold">
                Google Play
              </span>

              <span className="flex items-center justify-center rounded border border-white/60 bg-black px-3 py-2 text-xs font-semibold">
                App Store
              </span>
            </div>
          </div>

          {/* CUSTOMER REVIEWS */}
          <div>
            <h3 className="mb-4 text-sm font-bold">
              Customer reviews
            </h3>

            <div
              className="flex items-center gap-1 text-xl text-[#00B67A]"
              aria-label="Review section preview"
            >
              ★★★★★
            </div>

            <p className="mt-2 text-xs text-white/70">
              Customer review integration coming soon
            </p>
          </div>
        </div>

        {/* NEWSLETTER + LANGUAGE */}
        <div className="mt-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          {/* NEWSLETTER */}
          <div className="w-full max-w-[450px]">
            <h3 className="mb-3 text-sm font-bold">
              Get personalized game deals
            </h3>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full"
            >
              <label
                htmlFor="newsletter-email"
                className="sr-only"
              >
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                className="min-w-0 flex-1 border border-white/70 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFDD00]"
              />

              <button
                type="submit"
                disabled
                title="Newsletter subscriptions coming soon"
                className="border border-l-0 border-white/70 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                Subscribe
              </button>
            </form>

            <p className="mt-2 text-xs text-white/65">
              You can unsubscribe at any time. Visit{" "}
              <Link
                to="/privacy"
                className="underline hover:text-white"
              >
                Privacy notice
              </Link>{" "}
              for more information.
            </p>
          </div>

          {/* LANGUAGE / CURRENCY */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setLanguageOpen((open) => !open)
              }
              aria-expanded={languageOpen}
              aria-label="Language and currency"
              className="flex items-center gap-2 border border-white/70 px-4 py-2 text-xs font-bold hover:bg-white/10"
            >
              {/* GLOBE ICON */}
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
              </svg>

              <span>English EU | EUR</span>

              {/* DOWN ARROW */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {languageOpen && (
              <div className="absolute bottom-full right-0 mb-2 min-w-[190px] border border-white/20 bg-[#211342] p-3 shadow-xl">
                <p className="text-xs text-white/70">
                  More languages and currencies coming soon.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/65">
          <p>
            Copyright © {new Date().getFullYear()} Digital Marketplace.
            All rights reserved.{" "}
            <Link
              to="/terms"
              className="underline hover:text-white"
            >
              Terms and Conditions
            </Link>
            ,{" "}
            <Link
              to="/privacy"
              className="underline hover:text-white"
            >
              Privacy notice
            </Link>
            ,{" "}
            <Link
              to="/cookies"
              className="underline hover:text-white"
            >
              Cookie preferences
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
