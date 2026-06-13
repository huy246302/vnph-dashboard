import { getAwards } from "@/lib/db/awards";
import { createAward, updateAward, deleteAward } from "@/lib/actions/awards";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

const SCOPE_OPTIONS = ["world", "continental", "national", "other"];

const SCOPE_LABELS: Record<string, string> = {
  world:       "World",
  continental: "Continental",
  national:    "National",
  other:       "Other",
};

const SCOPE_COLORS: Record<string, string> = {
  world:       "bg-yellow-100 text-yellow-700",
  continental: "bg-blue-100 text-blue-700",
  national:    "bg-green-100 text-green-700",
  other:       "bg-gray-100 text-gray-600",
};

const awardFields = [
  { name: "name",        label: "Award Name",  required: true, span: 2 as const, placeholder: "Quả Bóng Vàng Việt Nam" },
  { name: "short_name",  label: "Short Name",  placeholder: "QBV" },
  { name: "scope",       label: "Scope",       type: "select" as const, options: SCOPE_OPTIONS },
  { name: "description", label: "Description", type: "textarea" as const, span: 2 as const, placeholder: "Annual award for the best Vietnamese footballer..." },
];

export default async function AwardsPage() {
  const awards = await getAwards();

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <PageHeader
          title="Awards"
          description={`${awards.length} award${awards.length !== 1 ? "s" : ""} total`}
        />
        <CreateButton
          label="Add Award"
          modalTitle="Add New Award"
          action={createAward}
          fields={awardFields}
        />
      </div>

      <TableWrapper>
        {awards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No awards yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Award&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Award</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {awards.map((award) => (
                <tr key={award.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{award.name}</p>
                    {award.short_name && (
                      <p className="text-xs text-gray-400">{award.short_name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {award.scope ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${SCOPE_COLORS[award.scope] ?? "bg-gray-100 text-gray-600"}`}>
                        {SCOPE_LABELS[award.scope] ?? award.scope}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {award.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      id={award.id}
                      label={award.name}
                      deleteAction={deleteAward}
                      updateAction={updateAward.bind(null, award.id)}
                      fields={awardFields.map((f) => ({
                        ...f,
                        defaultValue: String(award[f.name as keyof typeof award] ?? ""),
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