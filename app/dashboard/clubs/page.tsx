import { getClubs } from "@/lib/db/clubs";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <PageContainer>
      <PageHeader
            title="Clubs"
            description={`All clubs (${clubs.length})`}
      />
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