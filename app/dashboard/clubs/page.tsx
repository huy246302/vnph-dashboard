import { getClubs } from "@/lib/db/clubs";
import { createClub, updateClub, deleteClub } from "@/lib/actions/clubs";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

export default async function ClubsPage() {
  const clubs = await getClubs();

  const clubFields = [
    {
      name: "name",
      label: "Club Name",
      required: true,
      span: 2 as const,
      placeholder: "Manchester United",
    },
    {
      name: "short_name",
      label: "Short Name",
      placeholder: "MU",
    },
    {
      name: "league",
      label: "League",
      placeholder: "Premier League",
    },
    {
      name: "stadium",
      label: "Stadium",
      placeholder: "Old Trafford",
    },
    {
      name: "founded_year",
      label: "Founded Year",
      type: "number" as const,
      placeholder: "1878",
    },
  ];

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <PageHeader
            title="Clubs"
            description={`All clubs (${clubs.length})`}
          />
        </div>
        <CreateButton
          label="Add Club"
          modalTitle="Add New Club"
          action={createClub}
          fields={[
            { name: "name", label: "Club Name", required: true, span: 2, placeholder: "Hà Nội FC" },
            { name: "short_name", label: "Short Name", placeholder: "HN" },
            { name: "founded_year", label: "Founded Year", type: "number", placeholder: "2010" },
            { name: "stadium", label: "Stadium", placeholder: "Sân vận động Hàng Đẫy" },
            { name: "league", label: "League", placeholder: "V.League 1" },
            { name: "logo_url", label: "Logo URL", span: 2, placeholder: "https://..." },
          ]}
        />
      </div>
      <TableWrapper>
        <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Short Name</th>
              <th className="px-4 py-3">League</th>
              <th className="px-4 py-3">Stadium</th>
              <th className="px-4 py-3">Founded</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{club.name}</td>
                <td className="px-4 py-3 text-gray-500">{club.short_name ?? "—"}</td>
                <td className="px-4 py-3">{club.league ?? "—"}</td>
                <td className="px-4 py-3">{club.stadium ?? "—"}</td>
                <td className="px-4 py-3">{club.founded_year ?? "—"}</td>
                <td className="px-4 py-3">
                  <RowActions
                    id={club.id}
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
      </TableWrapper>
    </PageContainer>
  );
}