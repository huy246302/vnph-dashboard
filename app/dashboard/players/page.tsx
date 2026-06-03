import { getPlayers } from "@/lib/db/players";

export default async function PlayersPage() {
  const players = await getPlayers();
  const positionColors: Record<string, string> = {
    "Thủ môn": "bg-yellow-100 text-yellow-800",
    "Tiền đạo": "bg-red-100 text-red-800",
    "Hậu vệ": "bg-blue-100 text-blue-800",
    "Tiền vệ": "bg-green-100 text-green-800",
    };

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Players
          </h1>
          <p className="text-sm text-gray-500">
            All registered players ({players.length})
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="text-gray-700 uppercase text-xs">
                  <th className="px-5 py-4 text-left">
                    Name
                  </th>
                  <th className="px-5 py-4 text-left">
                    Position
                  </th>
                  <th className="px-5 py-4 text-left">
                    Club
                  </th>
                  <th className="px-5 py-4 text-center">
                    Birth Date
                  </th>
                  <th className="px-5 py-4 text-center">
                    Height
                  </th>
                  <th className="px-5 py-4 text-center">
                    Foot
                  </th>
                  <th className="px-5 py-4 text-center">
                    #
                  </th>
                  <th className="px-5 py-4 text-left">
                    Nationality
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr
                    key={player.id}
                    className={`
                      border-t border-gray-100
                      hover:bg-gray-50
                      transition-colors
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                    `}
                  >
                    <td className="px-5 py-4 font-medium">
                      {player.full_name}
                    </td>
                    <td className="px-5 py-4">
                        <span
                            className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${positionColors[player.position] || "bg-gray-100 text-gray-700"}
                            `}
                        >
                            {player.position}
                        </span>
                    </td>
                    <td className="px-5 py-4">
                      {player.current_club}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {new Date(
                        player.birth_date
                      ).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {player.height_cm} cm
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="px-2 py-1 rounded-md bg-gray-100">
                        {player.preferred_foot}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center font-semibold">
                      {player.club_jersey_number}
                    </td>
                    <td className="px-5 py-4">
                      {player.nationality}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}