import { getPlayerNationalTeams, getNationalTeamsForSelect } from "@/lib/db/player-national-team";
import {
  createPlayerNationalTeam,
  updatePlayerNationalTeam,
  deletePlayerNationalTeam,
} from "@/lib/actions/player-national-team";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";
import { toDisplayDate } from "@/lib/date-helpers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NationalTeamPage({ params }: Props) {
  const { id } = await params;
  const [entries, teams] = await Promise.all([
    getPlayerNationalTeams(id),
    getNationalTeamsForSelect(),
  ]);

  const teamOptions = teams.map((t) => t.name);
  const teamNameToId = new Map(teams.map((t) => [t.name, t.id]));
  const teamIdToName = new Map(teams.map((t) => [t.id, t.name]));

  const boundDelete = deletePlayerNationalTeam.bind(null, id);

  const fields = [
    { name: "national_team_id", label: "National Team", required: true, span: 2 as const, type: "select" as const, options: teamOptions },
    { name: "caps",             label: "Caps",  type: "number" as const },
    { name: "goals",            label: "Goals", type: "number" as const },
    { name: "debut_date",       label: "Debut Date", type: "date" as const },
    { name: "last_match_date",  label: "Last Match Date", type: "date" as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="National Team"
          description={`${entries.length} call-up${entries.length !== 1 ? "s" : ""}`}
        />
        <CreateButton
          label="Add National Team"
          modalTitle="Add National Team Record"
          action={async (formData: FormData) => {
            "use server";
            const teamName = formData.get("national_team_id") as string;
            const realId = teamNameToId.get(teamName);
            if (realId) formData.set("national_team_id", realId);
            await createPlayerNationalTeam(id, formData);
          }}
          fields={fields}
        />
      </div>

      <TableWrapper>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No national team history yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add National Team&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Caps</th>
                <th className="px-4 py-3">Goals</th>
                <th className="px-4 py-3">Debut</th>
                <th className="px-4 py-3">Last Match</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => {
                const team = entry.national_teams as unknown as { name: string } | null;
                const boundUpdate = async (formData: FormData) => {
                  "use server";
                  const teamName = formData.get("national_team_id") as string;
                  const realId = teamNameToId.get(teamName);
                  if (realId) formData.set("national_team_id", realId);
                  await updatePlayerNationalTeam(id, entry.id, formData);
                };

                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{team?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.caps}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.goals}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{toDisplayDate(entry.debut_date) || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{toDisplayDate(entry.last_match_date) || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        id={entry.id}
                        label={team?.name ?? "this entry"}
                        deleteAction={boundDelete}
                        updateAction={boundUpdate}
                        fields={fields.map((f) => {
                          if (f.name === "national_team_id") {
                            return { ...f, defaultValue: teamIdToName.get(entry.national_team_id) ?? "" };
                          }
                          return { ...f, defaultValue: String(entry[f.name as keyof typeof entry] ?? "") };
                        })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </TableWrapper>
    </div>
  );
}