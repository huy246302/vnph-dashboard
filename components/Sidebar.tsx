"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Players", href: "/dashboard/players" },
  { name: "Clubs", href: "/dashboard/clubs" },
  { name: "Profiles", href: "/dashboard/profiles" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r p-5">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Football DB</h2>
        <p className="text-sm text-gray-500">
          Admin Dashboard
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}