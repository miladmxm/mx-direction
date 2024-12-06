/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{ts,js,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        YekanBold: ["Yekan-Bold", "sans-serif"],
        YekanExtraBold: ["Yekan-ExtraBold", "sans-serif"],
        YekanLight: ["Yekan-Light", "sans-serif"],
        YekanRegular: ["Yekan-Regular", "sans-serif"],
        YekanSemiBold: ["Yekan-SemiBold", "sans-serif"],
        SpaceMonoRegular: ["SpaceMono-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
