import StatsCard from "@/components/StatsCard";

export default function DashboardPage() {
  return (
    <div className="px-8 py-10 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your football database</p>
      </div>
      <hr className="border-gray-200" />
      <div className="flex flex-wrap gap-6">
        <StatsCard title="Total Players" value={10} icon="user-multiple-4" />
        <StatsCard title="Total Clubs"   value={15} icon="trophy-1" />
        <StatsCard title="Total Profiles" value={0} icon="target-user" />
      </div>
    </div>
  );
}