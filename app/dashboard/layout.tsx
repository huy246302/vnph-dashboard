import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main style={{ padding: "20px", width: "100%" }}>
        {children}
      </main>
    </div>
  );
}