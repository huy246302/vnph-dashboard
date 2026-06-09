"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Players", href: "/dashboard/players" },
      { name: "Clubs", href: "/dashboard/clubs" },
      { name: "Profiles", href: "/dashboard/profiles" },
    ],
  },
  // {
  //   title: "Reference",
  //   items: [
  //     { name: "National Teams", href: "/dashboard/national-teams" },
  //     { name: "Trophies", href: "/dashboard/trophies" },
  //     { name: "Awards", href: "/dashboard/awards" },
  //   ],
  // },
  // {
  //   title: "Player Records",
  //   items: [
  //     { name: "Club History", href: "/dashboard/club-history" },
  //     { name: "Career Stats", href: "/dashboard/career-stats" },
  //     { name: "National Team Caps", href: "/dashboard/national-team-caps" },
  //     { name: "Player Trophies", href: "/dashboard/player-trophies" },
  //     { name: "Player Awards", href: "/dashboard/player-awards" },
  //     { name: "Career Events", href: "/dashboard/career-events" },
  //     { name: "Media", href: "/dashboard/media" },
  //     { name: "Nicknames", href: "/dashboard/nicknames" },
  //     { name: "Positions", href: "/dashboard/positions" },
  //   ],
  // },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r p-5 overflow-y-auto shrink-0">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Football DB</h2>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>

      <nav className="flex flex-col gap-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}