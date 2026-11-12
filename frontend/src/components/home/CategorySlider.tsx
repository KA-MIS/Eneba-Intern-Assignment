
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  CreditCard,
  Gift,
  Wallet,
  CircleDollarSign,
  Monitor,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categories = [
  { label: "Games", icon: Gamepad2, path: "/store" },
  { label: "Gaming eCards", icon: CreditCard, path: "/gift-cards" },
  { label: "eGift Cards", icon: Gift, path: "/gift-cards" },
  { label: "E-money", icon: Wallet, path: "/gift-cards" },
  { label: "Steam", icon: CircleDollarSign, path: "/store" },
  { label: "Steam Gift Cards", icon: Gift, path: "/gift-cards" },
  { label: "PSN", icon: Gamepad2, path: "/store" },
  { label: "Xbox", icon: Gamepad2, path: "/store" },
  { label: "FIFA", icon: Trophy, path: "/store" },
  { label: "Fortnite", icon: Monitor, path: "/store" },
  { label: "Amazon", icon: Gift, path: "/gift-cards" },
];

export function CategorySlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    sliderRef.current?.scrollBy({
      left: direction * 420,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-label="Shop by category"
      className="w-full bg-[#4519AC] text-white"
    >
      <div className="mx-auto flex max-w-[1250px] items-center gap-3 px-4 py-8">

        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => scroll(-1)}
          className="shrink-0 rounded-full p-2 text-white/70
            hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={22} />
        </button>

        <div
          ref={sliderRef}
          className="flex min-w-0 flex-1 gap-5 overflow-x-auto
            scroll-smooth [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden"
        >
          {categories.map(({ label, icon: Icon, path }) => (
            <Link
              key={label}
              to={path}
              className="group flex w-[90px] shrink-0
                flex-col items-center gap-2 text-center
                hover:text-lime focus-visible:outline-2
                focus-visible:outline-lime"
            >
              <Icon
                size={28}
                strokeWidth={1.8}
                aria-hidden="true"
                className="transition-transform duration-200
                  group-hover:scale-110"
              />

              <span className="text-[11px] font-semibold leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => scroll(1)}
          className="shrink-0 rounded-full p-2 text-white/70
            hover:bg-white/10 hover:text-white"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
