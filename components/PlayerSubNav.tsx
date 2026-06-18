"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SUB_NAV = [
  { name: "Edit",          href: "edit" },
  { name: "Nicknames",     href: "nicknames" },
  { name: "Club History",  href: "club-history" },
  { name: "National Team", href: "national-team" },
  { name: "Stats Cards",   href: "stats-cards" },
  { name: "Trophies",      href: "trophies" },
  { name: "Awards",        href: "awards" },
  { name: "Career Events", href: "career-events" },
  { name: "Media",         href: "media" },
];

type Props = {
  baseUrl: string;
};

export default function PlayerSubNav({ baseUrl }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex overflow-x-auto">
      {SUB_NAV.map((item) => {
        const href = `${baseUrl}/${item.href}`;
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={item.href}
            href={href}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}