import Link from "next/link";
import { getPlayers } from "@/lib/db/players";
import { deletePlayer } from "@/lib/actions/players";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

const positionColors: Record<string, string> = {
  "Thủ môn": "bg-yellow-100 text-yellow-800",
  "Tiền đạo": "bg-red-100 text-red-800",
  "Hậu vệ":  "bg-blue-100 text-blue-800",
  "Tiền vệ": "bg-green-100 text-green-800",
};

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <PageHeader
          title="Players"
          description={`${players.length} player${players.length !== 1 ? "s" : ""} total`}
        />
        <Link
          href="/dashboard/players/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add Player
        </Link>
      </div>

      <TableWrapper>
        {players.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No players yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Player&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
              <tr className="text-gray-500 uppercase text-xs">
                <th className="px-5 py-4 text-left">Name</th>
                <th className="px-5 py-4 text-left">Position</th>
                <th className="px-5 py-4 text-left">Club</th>
                <th className="px-5 py-4 text-left">Birth Date</th>
                <th className="px-5 py-4 text-left">Height</th>
                <th className="px-5 py-4 text-left">Foot</th>
                <th className="px-5 py-4 text-left">Nationality</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{player.full_name}</p>
                    {player.short_name && (
                      <p className="text-xs text-gray-400">{player.short_name}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {player.position ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${positionColors[player.position] ?? "bg-gray-100 text-gray-700"}`}>
                        {player.position}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{player.current_club ?? "—"}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {player.birth_date
                      ? new Date(player.birth_date).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {player.height_cm ? `${player.height_cm} cm` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    {player.preferred_foot ? (
                      <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                        {player.preferred_foot}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{player.nationality ?? "—"}</td>
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
      </TableWrapper>
    </PageContainer>
  );
}