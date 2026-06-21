import { getPlayerAwardsList, getAwardsForSelect } from "@/lib/db/player-awards";
import {
  createPlayerAward,
  updatePlayerAward,
  deletePlayerAward,
} from "@/lib/actions/player-awards";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PlayerAwardsPage({ params }: Props) {
  const { id } = await params;
  const [entries, awards] = await Promise.all([
    getPlayerAwardsList(id),
    getAwardsForSelect(),
  ]);

  const awardOptions = awards.map((a) => a.name);
  const awardNameToId = new Map(awards.map((a) => [a.name, a.id]));
  const awardIdToName = new Map(awards.map((a) => [a.id, a.name]));

  const boundDelete = deletePlayerAward.bind(null, id);

  const fields = [
    { name: "award_id", label: "Award", required: true, span: 2 as const, type: "select" as const, options: awardOptions },
    { name: "year",     label: "Year", type: "number" as const },
    { name: "notes",    label: "Notes", type: "textarea" as const, span: 2 as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Awards"
          description={`${entries.length} award${entries.length !== 1 ? "s" : ""}`}
        />
        <CreateButton
          label="Add Award"
          modalTitle="Add Award"
          action={async (formData: FormData) => {
            "use server";
            const awardName = formData.get("award_id") as string;
            const realId = awardNameToId.get(awardName);
            if (realId) formData.set("award_id", realId);
            await createPlayerAward(id, formData);
          }}
          fields={fields}
        />
      </div>

      <TableWrapper>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No awards yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Award&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Award</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => {
                const award = entry.awards as unknown as { name: string } | null;
                const boundUpdate = async (formData: FormData) => {
                  "use server";
                  const awardName = formData.get("award_id") as string;
                  const realId = awardNameToId.get(awardName);
                  if (realId) formData.set("award_id", realId);
                  await updatePlayerAward(id, entry.id, formData);
                };

                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{award?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.year ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{entry.notes ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        id={entry.id}
                        label={award?.name ?? "this award"}
                        deleteAction={boundDelete}
                        updateAction={boundUpdate}
                        fields={fields.map((f) => {
                          if (f.name === "award_id") {
                            return { ...f, defaultValue: awardIdToName.get(entry.award_id) ?? "" };
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