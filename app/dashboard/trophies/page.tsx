import { getTrophies } from "@/lib/db/tropies";
import { createTrophy, updateTrophy, deleteTrophy } from "@/lib/actions/trophies";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

const LEVEL_OPTIONS = [
  "world",
  "continental",
  "national",
  "domestic_cup",
  "domestic_league",
  "other",
];

const LEVEL_LABELS: Record<string, string> = {
  world:            "World",
  continental:      "Continental",
  national:         "National",
  domestic_cup:     "Domestic Cup",
  domestic_league:  "Domestic League",
  other:            "Other",
};

const LEVEL_COLORS: Record<string, string> = {
  world:            "bg-yellow-100 text-yellow-700",
  continental:      "bg-blue-100 text-blue-700",
  national:         "bg-green-100 text-green-700",
  domestic_cup:     "bg-purple-100 text-purple-700",
  domestic_league:  "bg-orange-100 text-orange-700",
  other:            "bg-gray-100 text-gray-600",
};

const trophyFields = [
  { name: "name",        label: "Trophy Name",  required: true, span: 2 as const, placeholder: "AFF Championship" },
  { name: "short_name",  label: "Short Name",   placeholder: "AFF" },
  { name: "level",       label: "Level",        type: "select" as const, options: LEVEL_OPTIONS },
  { name: "description", label: "Description",  type: "textarea" as const, span: 2 as const, placeholder: "Southeast Asian football tournament..." },
];

export default async function TrophiesPage() {
  const trophies = await getTrophies();

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <PageHeader
          title="Trophies"
          description={`${trophies.length} troph${trophies.length !== 1 ? "ies" : "y"} total`}
        />
        <CreateButton
          label="Add Trophy"
          modalTitle="Add New Trophy"
          action={createTrophy}
          fields={trophyFields}
        />
      </div>

      <TableWrapper>
        {trophies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No trophies yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Trophy&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Trophy</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trophies.map((trophy) => (
                <tr key={trophy.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{trophy.name}</p>
                    {trophy.short_name && (
                      <p className="text-xs text-gray-400">{trophy.short_name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {trophy.level ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${LEVEL_COLORS[trophy.level] ?? "bg-gray-100 text-gray-600"}`}>
                        {LEVEL_LABELS[trophy.level] ?? trophy.level}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {trophy.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      id={trophy.id}
                      label={trophy.name}
                      deleteAction={deleteTrophy}
                      updateAction={updateTrophy}
                      fields={trophyFields.map((f) => ({
                        ...f,
                        defaultValue: String(trophy[f.name as keyof typeof trophy] ?? ""),
                      }))}
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