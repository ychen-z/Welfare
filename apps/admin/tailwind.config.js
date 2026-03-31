/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1890ff",
        success: "#52c41a",
        warning: "#faad14",
        error: "#ff4d4f",
      },
    },
  },
  plugins: [],
  // 与 antd 共存，避免样式冲突
  corePlugins: {
    preflight: false,
  },
};
