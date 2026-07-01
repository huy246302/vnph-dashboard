import { getProfiles } from "@/lib/db/profiles";
import {
  createProfile,
  updateProfile,
  deleteProfile,
  approveProfile,
  blockProfile,
} from "@/lib/actions/profiles";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";
import { toDisplayDate } from "@/lib/date-helpers";

const statusStyles: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  blocked: "bg-red-100 text-red-700",
};

export default async function ProfilesPage() {
  const profiles = await getProfiles();
  const pendingProfiles = profiles.filter((p) => p.status === "pending");

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

      {pendingProfiles.length > 0 && (
        <div className="mt-6 mb-2">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Pending approval ({pendingProfiles.length})
          </h2>
          <div className="space-y-2">
            {pendingProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between border border-amber-200 bg-amber-50 rounded-xl px-4 py-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {profile.full_name ?? profile.username ?? "Unnamed user"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Signed up {toDisplayDate(profile.created_at?.split("T")[0])}
                  </span>
                </div>
                <div className="flex gap-2">
                  <form action={approveProfile.bind(null, profile.id)}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={blockProfile.bind(null, profile.id)}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
                    >
                      Block
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <TableWrapper>
          <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[profile.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {profile.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {toDisplayDate(profile.created_at?.split("T")[0])}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {profile.status !== "approved" && (
                        <form action={approveProfile.bind(null, profile.id)}>
                          <button
                            type="submit"
                            className="text-xs font-medium text-green-600 hover:text-green-700"
                          >
                            Approve
                          </button>
                        </form>
                      )}
                      {profile.status !== "blocked" && (
                        <form action={blockProfile.bind(null, profile.id)}>
                          <button
                            type="submit"
                            className="text-xs font-medium text-red-600 hover:text-red-700"
                          >
                            Block
                          </button>
                        </form>
                      )}
                      <RowActions
                        id={profile.id}
                        deleteAction={deleteProfile}
                        updateAction={updateProfile.bind(null, profile.id)}
                        fields={profileFields.map((f) => ({
                          ...f,
                          defaultValue: String(profile[f.name as keyof typeof profile] ?? ""),
                        }))}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </PageContainer>
  );
}