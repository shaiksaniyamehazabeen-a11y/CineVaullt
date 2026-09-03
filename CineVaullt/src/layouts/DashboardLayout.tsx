import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

function DashboardLayout() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar />

      <main className="mx-auto min-h-[calc(100vh-140px)] max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      <footer
        className={`border-t p-4 text-center ${
          theme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "bg-white"
        }`}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2026 CineVault. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default DashboardLayout;