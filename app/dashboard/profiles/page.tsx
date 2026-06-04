import { getProfiles } from "@/lib/db/profiles";

export default async function ProfilesPage() {
  const profiles = await getProfiles();

  return (
    <div className="px-8 py-10 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">Profiles</h1>
        <p className="text-gray-500 text-sm">All registered user profiles</p>
      </div>
      <hr className="border-gray-200" />
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
    </div>
  );
}