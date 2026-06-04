import { getProfiles } from "@/lib/db/profiles";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

export default async function ProfilesPage() {
  const profiles = await getProfiles();

  return (
    <PageContainer>
      <PageHeader
        title="Profiles"
        description={`All registered profiles (${profiles.length})`}
      />
      <TableWrapper>
        <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{profile.username ?? "—"}</td>
                <td className="px-4 py-3">{profile.full_name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.role === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {profile.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(profile.created_at).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </PageContainer>
  );
}