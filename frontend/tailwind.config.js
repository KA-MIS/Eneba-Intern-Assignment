
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0E0620",
        surface: "#1A0E33",
        elevated: "#251547",
        muted: "#12082A",
        lime: {
          DEFAULT: "#C6F135",
          hover: "#D4FF3F",
        },
        violet: "#7C3AED",
        magenta: "#E43B9B",
        cyan: "#35D0F1",
        ink: {
          primary: "#FFFFFF",
          secondary: "#B8AEDB",
          muted: "#6E6590",
        },
        line: {
          DEFAULT: "#2E1E52",
          hover: "#4A3480",
        },
      },
      fontFamily: {
        display: ["Chakra Petch", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      boxShadow: {
        lime: "0 0 0 1px #C6F135, 0 8px 24px -8px #C6F13566",
        card: "0 8px 32px -8px #00000099",
        glow: "0 0 40px -8px #7C3AED88",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(60% 80% at 70% 20%, #7C3AED55 0%, transparent 60%), radial-gradient(50% 60% at 10% 90%, #C6F13522 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
