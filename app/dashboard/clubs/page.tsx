import { getClubs } from "@/lib/db/clubs";
import { createClub } from "@/lib/actions/clubs";
import CreateButton from "@/components/CreateButton";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

export default async function ClubsPage() {
  const clubs = await getClubs();

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
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </PageContainer>
  );
}