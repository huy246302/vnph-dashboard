import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated users to /login,
  // but this is a safety net in case the layout is ever reached directly.
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("status, role, full_name, username")
    .eq("id", user.id)
    .single();

  // No profile row at all — trigger should always create one, but
  // guard against edge cases (e.g. trigger disabled/misconfigured).
  if (!profile) {
    return (
      <StatusScreen
        title="Account setup incomplete"
        message="We couldn't find a profile for your account. Please contact an admin."
      />
    );
  }

  if (profile.status === "blocked") {
    return (
      <StatusScreen
        title="Access blocked"
        message="Your account has been blocked. Contact an admin if you think this is a mistake."
      />
    );
  }

  if (profile.status === "pending") {
    return (
      <StatusScreen
        title="Pending approval"
        message="Your account is signed in but hasn't been approved yet. An admin needs to grant you access before you can use the dashboard."
      />
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        userEmail={user.email ?? ""}
        userName={profile.full_name ?? profile.username ?? undefined}
        userRole={profile.role ?? undefined}
      />
      <main style={{ padding: "20px", width: "100%" }}>{children}</main>
    </div>
  );
}

function StatusScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}