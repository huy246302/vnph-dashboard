import Img from "next/image";
import { getClubs } from "@/lib/db/clubs";
import { createClub, updateClub, deleteClub } from "@/lib/actions/clubs";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

// Single source of truth for club fields — used by both CreateButton and RowActions
const clubFields = [
  { name: "name",         label: "Club Name",    required: true, span: 2 as const, placeholder: "Hà Nội FC" },
  { name: "short_name",   label: "Short Name",   placeholder: "HN" },
  { name: "founded_year", label: "Founded Year", type: "number" as const, placeholder: "2010" },
  { name: "stadium",      label: "Stadium",      placeholder: "Sân vận động Hàng Đẫy" },
  { name: "league",       label: "League",       placeholder: "V.League 1" },
  { name: "logo_url",     label: "Logo URL",     span: 2 as const, placeholder: "https://..." },
];

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <PageHeader
          title="Clubs"
          description={`${clubs.length} club${clubs.length !== 1 ? "s" : ""} total`}
        />
        <CreateButton
          label="Add Club"
          modalTitle="Add New Club"
          action={createClub}
          fields={clubFields}
        />
      </div>

      <TableWrapper>
        {clubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No clubs yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Club&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Club</th>
                <th className="px-4 py-3">League</th>
                <th className="px-4 py-3">Stadium</th>
                <th className="px-4 py-3">Founded</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-gray-50 transition-colors">
                  {/* Club name + logo + short name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {club.logo_url ? (
                        <Img
                          src={club.logo_url}
                          alt={club.name}
                          width={28}
                          height={28}
                          className="w-7 h-7 object-contain rounded"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold shrink-0">
                          {club.short_name?.[0] ?? club.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{club.name}</p>
                        {club.short_name && (
                          <p className="text-xs text-gray-400">{club.short_name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{club.league ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{club.stadium ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{club.founded_year ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      id={club.id}
                      label={club.name}
                      deleteAction={deleteClub}
                      updateAction={updateClub}
                      fields={clubFields.map((f) => ({
                        ...f,
                        defaultValue: String(club[f.name as keyof typeof club] ?? ""),
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