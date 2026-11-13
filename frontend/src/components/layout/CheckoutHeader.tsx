
import { Link, useLocation } from "react-router-dom";

export function CheckoutHeader() {
  const location = useLocation();

  const currentStep =
    location.pathname === "/cart" ? 1 :
    location.pathname === "/checkout" ? 2 : 3;

  const steps = [
    { number: 1, label: "Cart" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Get your product" },
  ];

  return (
    <header className="w-full bg-[#211047] text-white">
      <div className="mx-auto flex min-h-[74px] max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        {/* LOGO */}
        <Link to="/" aria-label="Back to homepage">
          <img
            src="/images/Logo.png"
            alt="Store logo"
            className="h-10 w-auto max-w-[150px] object-contain"
          />
        </Link>

        {/* CHECKOUT PROGRESS */}
        <nav
          aria-label="Checkout progress"
          className="order-3 flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto sm:flex-1 sm:px-8"
        >
          {steps.map((step, index) => {
            const active = step.number === currentStep;
            const completed = step.number < currentStep;

            return (
              <div
                key={step.number}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <div className="h-px w-4 bg-white/30 md:w-16" />
                )}

                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                    (active
                      ? "bg-[#C6F135] text-[#211047]"
                      : completed
                      ? "bg-[#35D0F1] text-[#211047]"
                      : "bg-white/20 text-white/60")
                  }
                >
                  {completed ? "✓" : step.number}
                </span>

                <span
                  className={
                    "whitespace-nowrap text-xs " +
                    (active
                      ? "font-bold text-white"
                      : "text-white/50")
                  }
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* LANGUAGE */}
        <div className="shrink-0 text-xs font-semibold text-white/80">
          🌐 English EU | EUR
        </div>
      </div>
    </header>
  );
}
