import { getPlayerClubHistory } from "@/lib/db/player-club-history";
import { getClubsForSelect } from "@/lib/db/clubs";
import {
  createClubHistoryEntry,
  updateClubHistoryEntry,
  deleteClubHistoryEntry,
} from "@/lib/actions/player-club-history";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

type ClubOption = { id: string; name: string; short_name: string | null };

export default async function ClubHistoryPage({ params }: Props) {
  const { id } = await params;
  const [entries, clubs]: [
    Awaited<ReturnType<typeof getPlayerClubHistory>>,
    ClubOption[]
  ] = await Promise.all([getPlayerClubHistory(id), getClubsForSelect()]);

  const clubOptions = clubs.map((c: ClubOption) => c.name);
  const clubNameToId = new Map(clubs.map((c: ClubOption) => [c.name, c.id]));
  const clubIdToName = new Map(clubs.map((c: ClubOption) => [c.id, c.name]));

  const boundCreate = createClubHistoryEntry.bind(null, id);
  const boundDelete = deleteClubHistoryEntry.bind(null, id);

  const fields = [
    { name: "club_id",       label: "Club",          required: true, span: 2 as const, type: "select" as const, options: clubOptions, defaultValue: "" },
    { name: "jersey_number", label: "Jersey Number", type: "number" as const, defaultValue: "" },
    { name: "joined_at",     label: "Joined",         type: "date" as const, defaultValue: "" },
    { name: "left_at",       label: "Left (blank = current)", type: "date" as const, defaultValue: "" },
    { name: "transfer_fee",  label: "Transfer Fee",   type: "number" as const, defaultValue: "" },
    { name: "is_loan",       label: "On Loan?",       type: "select" as const, options: ["false", "true"], defaultValue: "false" },
    { name: "appearances",   label: "Appearances",    type: "number" as const, defaultValue: "" },
    { name: "goals",         label: "Goals",          type: "number" as const, defaultValue: "" },
    { name: "assists",       label: "Assists",        type: "number" as const, defaultValue: "" },
    { name: "is_captain",    label: "Was Captain?",   type: "select" as const, options: ["false", "true"], defaultValue: "false" },
    { name: "notes",         label: "Notes",          type: "textarea" as const, span: 2 as const, defaultValue: "" },
  ];

  async function createWithClubResolution(formData: FormData) {
    "use server";
    const clubName = formData.get("club_id");
    if (typeof clubName === "string") {
      const realId = clubNameToId.get(clubName);
      if (realId) formData.set("club_id", realId);
    }
    await boundCreate(formData);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Club History"
          description={`${entries.length} spell${entries.length !== 1 ? "s" : ""}`}
        />
        <CreateButton
          label="Add Club Spell"
          modalTitle="Add Club History Entry"
          action={createWithClubResolution}
          fields={fields}
        />
      </div>

      <TableWrapper>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No club history yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Club Spell&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Club</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Apps</th>
                <th className="px-4 py-3">Goals</th>
                <th className="px-4 py-3">Assists</th>
                <th className="px-4 py-3">Captain</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => {
                const club = entry.clubs as unknown as { name: string } | null;

                async function updateWithClubResolution(formData: FormData) {
                  "use server";
                  const clubName = formData.get("club_id");
                  if (typeof clubName === "string") {
                    const realId = clubNameToId.get(clubName);
                    if (realId) formData.set("club_id", realId);
                  }
                  await updateClubHistoryEntry(id, entry.id, formData);
                }

                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {club?.name ?? "—"}
                      {entry.is_loan && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-amber-50 text-amber-600 font-medium">
                          Loan
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {entry.joined_at ?? "?"} – {entry.left_at ?? "present"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{entry.appearances}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.goals}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.assists}</td>
                    <td className="px-4 py-3">
                      {entry.is_captain ? (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600 font-medium">
                          Captain
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        id={entry.id}
                        label={club?.name ?? "this entry"}
                        deleteAction={boundDelete}
                        updateAction={updateWithClubResolution}
                        fields={fields.map((f) => {
                          if (f.name === "club_id") {
                            return { ...f, defaultValue: clubIdToName.get(entry.club_id) ?? "" };
                          }
                          if (f.name === "is_loan" || f.name === "is_captain") {
                            const key = f.name as "is_loan" | "is_captain";
                            return { ...f, defaultValue: String(entry[key]) };
                          }
                          const value = entry[f.name as keyof typeof entry];
                          return { ...f, defaultValue: value === null || value === undefined ? "" : String(value) };
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