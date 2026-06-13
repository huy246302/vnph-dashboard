import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerById } from "@/lib/db/players";
import PlayerSubNav from "@/components/PlayerSubNav";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const positionColors: Record<string, string> = {
  "Thủ môn": "bg-yellow-100 text-yellow-800",
  "Tiền đạo": "bg-red-100 text-red-800",
  "Hậu vệ":  "bg-blue-100 text-blue-800",
  "Tiền vệ": "bg-green-100 text-green-800",
};

export default async function PlayerLayout({ children, params }: Props) {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) notFound();

  const baseUrl = `/dashboard/players/${id}`;

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Back link */}
        <Link
          href="/dashboard/players"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
        >
          ← Back to Players
        </Link>

        {/* Player header card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
          <div className="flex items-center gap-5">

            {/* Avatar */}
            {player.profile_image_url ? (
              <Image
                src={player.profile_image_url}
                alt={player.full_name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold shrink-0">
                {player.full_name[0]}
              </div>
            )}

            {/* Player info */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {player.full_name}
                </h1>
                {player.is_retired && (
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-medium shrink-0">
                    Retired
                  </span>
                )}
                {player.nationality && player.nationality !== "Việt Nam" && (
                  <span className="px-2 py-0.5 rounded text-xs bg-orange-50 text-orange-600 font-medium shrink-0">
                    {player.nationality}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {player.position && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${positionColors[player.position] ?? "bg-gray-100 text-gray-700"}`}>
                    {player.position}
                  </span>
                )}
                {player.primary_era && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                    {player.primary_era}
                  </span>
                )}
                {player.current_club && (
                  <span className="text-sm text-gray-500">{player.current_club}</span>
                )}
                {(player.career_start_year || player.career_end_year) && (
                  <span className="text-xs text-gray-400">
                    {player.career_start_year ?? "?"} – {player.career_end_year ?? "present"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sub-nav — client component for active detection */}
          <div className="mt-5 -mb-5 -mx-6 px-6 border-t border-gray-100">
            <PlayerSubNav baseUrl={baseUrl} />
          </div>
        </div>

        {/* Page content */}
        {children}

      </div>
    </div>
  );
}