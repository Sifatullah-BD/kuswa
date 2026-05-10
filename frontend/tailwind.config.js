/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Hind Siliguri", "system-ui", "sans-serif"],
        bn: ["Hind Siliguri", "Noto Sans Bengali", "sans-serif"],
        en: ["Poppins", "Montserrat", "system-ui", "sans-serif"],
        display: ["Montserrat", "Poppins", "sans-serif"],
      },
      colors: {
        kuswa: {
          "dark-blue": "#0D4F97",
          "blue": "#1E73BE",
          "light-blue": "#56C2F0",
          "orange": "#F28C28",
          "gold": "#F5B14C",
          "bg": "#F5F5F5",
          "ink": "#1A202C",
          "muted": "#4A5568",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-header": "linear-gradient(90deg, #0D4F97, #56C2F0)",
        "gradient-button": "linear-gradient(90deg, #F28C28, #F5B14C)",
        "gradient-section": "linear-gradient(135deg, #1E73BE, #56C2F0)",
      },
      boxShadow: {
        "soft": "0 8px 24px rgba(13, 79, 151, 0.08)",
        "softer": "0 4px 14px rgba(13, 79, 151, 0.06)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
