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

type TrophyOption = { id: string; name: string; short_name: string | null };
type ClubOption = { id: string; name: string; short_name: string | null };

const NATIONAL_TEAM_LABEL = "— National Team —";

export default async function PlayerTrophiesPage({ params }: Props) {
  const { id } = await params;
  const [entries, trophies, clubs]: [
    Awaited<ReturnType<typeof getPlayerTrophiesList>>,
    TrophyOption[],
    ClubOption[]
  ] = await Promise.all([
    getPlayerTrophiesList(id),
    getTrophiesForSelect(),
    getClubsForSelect(),
  ]);

  const trophyOptions = trophies.map((t: TrophyOption) => t.name);
  const trophyNameToId = new Map(trophies.map((t: TrophyOption) => [t.name, t.id]));
  const trophyIdToName = new Map(trophies.map((t: TrophyOption) => [t.id, t.name]));

  const clubOptions = [NATIONAL_TEAM_LABEL, ...clubs.map((c: ClubOption) => c.name)];
  const clubNameToId = new Map(clubs.map((c: ClubOption) => [c.name, c.id]));
  const clubIdToName = new Map(clubs.map((c: ClubOption) => [c.id, c.name]));

  const boundDelete = deletePlayerTrophy.bind(null, id);

  const fields = [
    { name: "trophy_id", label: "Trophy", required: true, span: 2 as const, type: "select" as const, options: trophyOptions, defaultValue: "" },
    { name: "club_id",   label: "Club (or National Team)", span: 2 as const, type: "select" as const, options: clubOptions, defaultValue: NATIONAL_TEAM_LABEL },
    { name: "year",      label: "Year", type: "number" as const, defaultValue: "" },
    { name: "notes",     label: "Notes", type: "textarea" as const, span: 2 as const, defaultValue: "" },
  ];

  // Named top-level server action — resolves both trophy_id and club_id
  // from display names back to UUIDs before inserting.
  async function createTrophyWithResolution(formData: FormData) {
    "use server";

    const trophyName = formData.get("trophy_id");
    if (typeof trophyName === "string") {
      const realTrophyId = trophyNameToId.get(trophyName);
      if (realTrophyId) formData.set("trophy_id", realTrophyId);
    }

    const clubName = formData.get("club_id");
    if (typeof clubName === "string") {
      if (clubName === NATIONAL_TEAM_LABEL || clubName === "") {
        formData.set("club_id", "");
      } else {
        const realClubId = clubNameToId.get(clubName);
        if (realClubId) formData.set("club_id", realClubId);
      }
    }

    await createPlayerTrophy(id, formData);
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
          action={createTrophyWithResolution}
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
                const entryId = entry.id;

                // Named top-level server action per row — bound via closure
                // over entryId only (a primitive string), not over any Map.
                async function updateTrophyWithResolution(formData: FormData) {
                  "use server";

                  const trophyName = formData.get("trophy_id");
                  if (typeof trophyName === "string") {
                    const realTrophyId = trophyNameToId.get(trophyName);
                    if (realTrophyId) formData.set("trophy_id", realTrophyId);
                  }

                  const clubName = formData.get("club_id");
                  if (typeof clubName === "string") {
                    if (clubName === NATIONAL_TEAM_LABEL || clubName === "") {
                      formData.set("club_id", "");
                    } else {
                      const realClubId = clubNameToId.get(clubName);
                      if (realClubId) formData.set("club_id", realClubId);
                    }
                  }

                  await updatePlayerTrophy(id, entryId, formData);
                }

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
                        updateAction={updateTrophyWithResolution}
                        fields={fields.map((f) => {
                          if (f.name === "trophy_id") {
                            return { ...f, defaultValue: trophyIdToName.get(entry.trophy_id) ?? "" };
                          }
                          if (f.name === "club_id") {
                            return {
                              ...f,
                              defaultValue: entry.club_id
                                ? (clubIdToName.get(entry.club_id) ?? "")
                                : NATIONAL_TEAM_LABEL,
                            };
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