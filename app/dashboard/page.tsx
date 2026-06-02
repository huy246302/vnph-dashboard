import StatsCard from "@/components/StatsCard";
import { getDashboardStats } from "@/lib/db/dashboard";

export default async function DashboardPage() {
  const { totalPlayers, totalClubs, totalProfiles } = await getDashboardStats();

  return (
    <div className="px-8 py-10 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your football database</p>
      </div>
      <hr className="border-gray-200" />
      <div className="flex flex-wrap gap-6">
        <StatsCard title="Total Players" value={totalPlayers} icon="user-multiple-4" />
        <StatsCard title="Total Clubs"   value={totalClubs} icon="trophy-1" />
        <StatsCard title="Total Profiles" value={totalProfiles} icon="target-user" />
      </div>
    </div>
  );
}