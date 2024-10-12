/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"]
      },
      colors: {
        "pale-purple": "#F1E3F3",
        "periwinkle": "#C2BBF0",
        "amaranth-pink": "#F698BB",
        "deep-sky-blue": "#62BFED",
        "dodger-blue": "#3590F3",
      },
      keyframes: {
        /* Defines a custom keyframe animation named gradient*/
        gradient: { 
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      /* Creates a Tailwind utility class called animate-gradient*/
      animation: {
        gradient: "gradient 6s linear infinite", 
      },
    },
  },
  plugins: [],
}
