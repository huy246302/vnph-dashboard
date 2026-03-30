import StatsCard from "@/components/StatsCard";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Overview of your football database</p>

      <div style={{ display: "flex", gap: "20px" }}>
        <StatsCard title="Total Players" value={10} />
        <StatsCard title="Total Clubs" value={15} />
        <StatsCard title="Total Profiles" value={0} />
      </div>
    </div>
  );
}