export default function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 w-64 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{title}</p>
        <i className={`lni lni-${icon} text-xl text-blue-500`}></i>
      </div>
      <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}