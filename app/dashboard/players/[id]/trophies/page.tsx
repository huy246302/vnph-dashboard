import { getPlayerTrophiesList, getTrophiesForSelect } from "@/lib/db/player-trophies";
import { getClubsForSelect } from "@/lib/db/clubs";
import {
  createPlayerTrophy,
  updatePlayerTrophy,
  deletePlayerTrophy,
} from "@/lib/actions/player-trophies";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PlayerTrophiesPage({ params }: Props) {
  const { id } = await params;
  const [entries, trophies, clubs] = await Promise.all([
    getPlayerTrophiesList(id),
    getTrophiesForSelect(),
    getClubsForSelect(),
  ]);

  const trophyOptions = trophies.map((t) => t.name);
  const trophyNameToId = new Map(trophies.map((t) => [t.name, t.id]));
  const trophyIdToName = new Map(trophies.map((t) => [t.id, t.name]));

  // Club is optional (NULL = won with national team)
  const clubOptions = ["— National Team —", ...clubs.map((c) => c.name)];
  const clubNameToId = new Map(clubs.map((c) => [c.name, c.id]));
  const clubIdToName = new Map(clubs.map((c) => [c.id, c.name]));

  const boundDelete = deletePlayerTrophy.bind(null, id);

  const fields = [
    { name: "trophy_id", label: "Trophy", required: true, span: 2 as const, type: "select" as const, options: trophyOptions },
    { name: "club_id",   label: "Club (or National Team)", span: 2 as const, type: "select" as const, options: clubOptions },
    { name: "year",      label: "Year", type: "number" as const },
    { name: "notes",     label: "Notes", type: "textarea" as const, span: 2 as const },
  ];

  function resolveClubId(formData: FormData) {
    const clubName = formData.get("club_id") as string;
    if (!clubName || clubName === "— National Team —") {
      formData.set("club_id", "");
    } else {
      const realId = clubNameToId.get(clubName);
      if (realId) formData.set("club_id", realId);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Trophies"
          description={`${entries.length} troph${entries.length !== 1 ? "ies" : "y"}`}
        />
        <CreateButton
          label="Add Trophy"
          modalTitle="Add Trophy"
          action={async (formData: FormData) => {
            "use server";
            const trophyName = formData.get("trophy_id") as string;
            const realTrophyId = trophyNameToId.get(trophyName);
            if (realTrophyId) formData.set("trophy_id", realTrophyId);
            resolveClubId(formData);
            await createPlayerTrophy(id, formData);
          }}
          fields={fields}
        />
      </div>

      <TableWrapper>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No trophies yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Trophy&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Trophy</th>
                <th className="px-4 py-3">Won With</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => {
                const trophy = entry.trophies as unknown as { name: string } | null;
                const club = entry.clubs as unknown as { name: string } | null;
                const boundUpdate = async (formData: FormData) => {
                  "use server";
                  const trophyName = formData.get("trophy_id") as string;
                  const realTrophyId = trophyNameToId.get(trophyName);
                  if (realTrophyId) formData.set("trophy_id", realTrophyId);
                  resolveClubId(formData);
                  await updatePlayerTrophy(id, entry.id, formData);
                };

                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{trophy?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{club?.name ?? "National Team"}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.year ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        id={entry.id}
                        label={trophy?.name ?? "this trophy"}
                        deleteAction={boundDelete}
                        updateAction={boundUpdate}
                        fields={fields.map((f) => {
                          if (f.name === "trophy_id") {
                            return { ...f, defaultValue: trophyIdToName.get(entry.trophy_id) ?? "" };
                          }
                          if (f.name === "club_id") {
                            return { ...f, defaultValue: entry.club_id ? (clubIdToName.get(entry.club_id) ?? "") : "— National Team —" };
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