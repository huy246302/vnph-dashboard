"use client";

import { useState, useMemo } from "react";
import RowActions from "@/components/RowActions";
import { deletePlayer } from "@/lib/actions/players";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Player = {
  id: string;
  full_name: string;
  short_name: string | null;
  position: string | null;
  primary_era: string | null;
  current_club: string | null;
  career_start_year: number | null;
  career_end_year: number | null;
  is_retired: boolean | null;
  nationality: string | null;
};

type Props = {
  players: Player[];
};

const positionColors: Record<string, string> = {
  "Thủ môn": "bg-yellow-100 text-yellow-800",
  "Tiền đạo": "bg-red-100 text-red-800",
  "Hậu vệ":  "bg-blue-100 text-blue-800",
  "Tiền vệ": "bg-green-100 text-green-800",
};

const POSITIONS = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];
const ERAS = [
  "pre-1930s","1930s","1940s","1950s","1960s",
  "1970s","1980s","1990s","2000s","2010s","2020s",
];

export default function PlayersTable({ players }: Props) {
  const [search, setSearch]       = useState("");
  const [position, setPosition]   = useState("");
  const [era, setEra]             = useState("");
  const [retired, setRetired]     = useState("");

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matchName  = p.full_name.toLowerCase().includes(q);
        const matchShort = p.short_name?.toLowerCase().includes(q);
        const matchClub  = p.current_club?.toLowerCase().includes(q);
        if (!matchName && !matchShort && !matchClub) return false;
      }
      if (position && p.position !== position) return false;
      if (era && p.primary_era !== era) return false;
      if (retired === "true"  && !p.is_retired)  return false;
      if (retired === "false" &&  p.is_retired)  return false;
      return true;
    });
  }, [players, search, position, era, retired]);

  const hasFilters = search || position || era || retired;

  function clearFilters() {
    setSearch("");
    setPosition("");
    setEra("");
    setRetired("");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or club..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
        </div>

        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="">All Positions</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={era}
          onChange={(e) => setEra(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="">All Eras</option>
          {ERAS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select
          value={retired}
          onChange={(e) => setRetired(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="">All Players</option>
          <option value="false">Active</option>
          <option value="true">Retired</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} of {players.length} players
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 text-sm">
                {hasFilters ? "No players match your filters." : "No players yet."}
              </p>
              {hasFilters ? (
                <button
                  onClick={clearFilters}
                  className="text-blue-500 text-xs mt-1 hover:underline"
                >
                  Clear filters
                </button>
              ) : (
                <p className="text-gray-300 text-xs mt-1">
                  Click &quot;Add Player&quot; to get started.
                </p>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-500 uppercase text-xs">
                  <th className="px-5 py-4 text-left">Name</th>
                  <th className="px-5 py-4 text-left">Position</th>
                  <th className="px-5 py-4 text-left">Era</th>
                  <th className="px-5 py-4 text-left">Club</th>
                  <th className="px-5 py-4 text-left">Career</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{player.full_name}</p>
                          {player.short_name && (
                            <p className="text-xs text-gray-400">{player.short_name}</p>
                          )}
                        </div>
                        {player.is_retired && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-medium shrink-0">
                            Retired
                          </span>
                        )}
                        {player.nationality && player.nationality !== "Việt Nam" && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-orange-50 text-orange-600 font-medium shrink-0">
                            {player.nationality}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {player.position ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${positionColors[player.position] ?? "bg-gray-100 text-gray-700"}`}>
                          {player.position}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-5 py-4">
                      {player.primary_era ? (
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                          {player.primary_era}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {player.current_club ?? <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-5 py-4 text-gray-600 text-xs">
                      {player.career_start_year || player.career_end_year ? (
                        <span>
                          {player.career_start_year ?? "?"} – {player.career_end_year ?? "present"}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <RowActions
                        id={player.id}
                        label={player.full_name}
                        editHref={`/dashboard/players/${player.id}/edit`}
                        deleteAction={deletePlayer}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}