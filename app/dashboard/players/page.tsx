import { getPlayers } from "@/lib/db/players";
import { createPlayer, updatePlayer, deletePlayer } from "@/lib/actions/players";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

export default async function PlayersPage() {
  const players = await getPlayers();
  
  const playerFields = [
    { name: "full_name", label: "Full Name", required: true, span: 2 as const, placeholder: "Nguyễn Văn A" },
    { name: "short_name", label: "Short Name", placeholder: "Văn A" },
    { name: "nationality", label: "Nationality" },
    { name: "birth_date", label: "Birth Date", type: "date" as const },
    { name: "position", label: "Position", type: "select" as const, options: ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"] },
    { name: "height_cm", label: "Height (cm)", type: "number" as const },
    { name: "preferred_foot", label: "Preferred Foot", type: "select" as const, options: ["left", "right", "both"] },
    { name: "current_club", label: "Current Club" },
    { name: "club_jersey_number", label: "Jersey Number", type: "number" as const },
    { name: "bio", label: "Bio", type: "textarea" as const, span: 2 as const },
  ];

  const positionColors: Record<string, string> = {
    "Thủ môn": "bg-yellow-100 text-yellow-800",
    "Tiền đạo": "bg-red-100 text-red-800",
    "Hậu vệ": "bg-blue-100 text-blue-800",
    "Tiền vệ": "bg-green-100 text-green-800",
    };

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <PageHeader
            title="Players"
            description={`All players (${players.length})`}
          /> 
        </div>
        <CreateButton
          label="Add Player"
          modalTitle="Add New Player"
          action={createPlayer}
          fields={[
            { name: "full_name", label: "Full Name", required: true, span: 2, placeholder: "Nguyễn Văn A" },
            { name: "short_name", label: "Short Name", placeholder: "Văn A" },
            { name: "nationality", label: "Nationality", defaultValue: "Việt Nam" },
            { name: "birth_date", label: "Birth Date", type: "date" },
            { name: "position", label: "Position", type: "select", options: ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"] },
            { name: "height_cm", label: "Height (cm)", type: "number", placeholder: "175" },
            { name: "preferred_foot", label: "Preferred Foot", type: "select", options: ["left", "right", "both"] },
            { name: "current_club", label: "Current Club", placeholder: "Club name" },
            { name: "club_jersey_number", label: "Jersey Number", type: "number", placeholder: "10" },
            { name: "bio", label: "Bio", type: "textarea", span: 2, placeholder: "Short biography..." },
          ]}
        />
      </div>
      <TableWrapper>
        <table className="w-full min-w-275 text-sm">
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
              <th className="px-4 py-3">
                Actions
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
                <td className="px-4 py-3">
                  <RowActions
                    id={player.id}
                    deleteAction={deletePlayer}
                    updateAction={updatePlayer}
                    fields={playerFields.map((f) => ({
                      ...f,
                      defaultValue: String(player[f.name as keyof typeof player] ?? ""),
                    }))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </PageContainer>
  );
}