import { getProfiles } from "@/lib/db/profiles";
import{ createProfile, updateProfile, deleteProfile } from "@/lib/actions/profiles";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

export default async function ProfilesPage() {
  const profiles = await getProfiles();

  const profileFields = [
  {
    name: "username",
    label: "Username",
    required: true,
    placeholder: "nguyenvana",
  },
  {
    name: "full_name",
    label: "Full Name",
    required: true,
    span: 2 as const,
    placeholder: "Nguyễn Văn A",
  },
  {
    name: "role",
    label: "Role",
    type: "select" as const,
    options: ["admin", "user"],
  },
  {
    name: "created_at",
    label: "Created At",
    type: "date" as const,
  },
];

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <PageHeader
            title="Profiles"
            description={`All registered profiles (${profiles.length})`}
          />
        </div>
        <CreateButton
          label="Add Profile"
          modalTitle="Add New Profile"
          action={createProfile}
          fields={[
            { name: "email", label: "Email", required: true, span: 2, placeholder: "user@example.com" },
            { name: "password", label: "Password", type: "password", required: true, span: 2, placeholder: "Min 6 characters" },
            { name: "username", label: "Username", placeholder: "nguyen_van_a" },
            { name: "full_name", label: "Full Name", placeholder: "Nguyễn Văn A" },
            { name: "role", label: "Role", type: "select", options: ["user", "admin"] },
            { name: "avatar_url", label: "Avatar URL", span: 2, placeholder: "https://..." },
          ]}
        />
      </div>
      <TableWrapper>
        <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Actions</th>
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
                <td className="px-4 py-3">
                  <RowActions
                    id={profile.id}
                    deleteAction={deleteProfile}
                    updateAction={updateProfile.bind(null, profile.id)}
                    fields={profileFields.map((f) => ({
                      ...f,
                      defaultValue: String(profile[f.name as keyof typeof profile] ?? ""),
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