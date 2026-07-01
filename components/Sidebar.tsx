"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "Main",
    items: [
      { name: "Dashboard",  href: "/dashboard" },
      { name: "Players",    href: "/dashboard/players" },
      { name: "Clubs",      href: "/dashboard/clubs" },
      { name: "Profiles",   href: "/dashboard/profiles" },
    ],
  },
  {
    title: "Reference",
    items: [
      { name: "National Teams", href: "/dashboard/national-teams" },
      { name: "Trophies",       href: "/dashboard/trophies" },
      { name: "Awards",         href: "/dashboard/awards" },
    ],
  },
];

type SidebarProps = {
  userEmail?: string;
  userName?: string;
  userRole?: string;
};

export default function Sidebar({ userEmail, userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-screen border-r p-5 overflow-y-auto shrink-0 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Football DB</h2>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      <nav className="flex flex-col gap-6 flex-1">
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
      <div className="pt-4 mt-4 border-t border-gray-100">
        {(userName || userEmail) && (
          <div className="px-3 mb-3">
            <p className="text-sm font-medium text-gray-800 truncate">
              {userName || userEmail}
            </p>
            <div className="flex items-center gap-2">
              {userEmail && userName && (
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              )}
              {userRole && (
                <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 shrink-0">
                  {userRole}
                </span>
              )}
            </div>
          </div>
        )}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <span className="text-base leading-none">
              <i className="lni lni-exit" />
            </span>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}