export default function StatsCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px",
      width: "200px"
    }}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}