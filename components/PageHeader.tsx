type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold tracking-tight">
        {title}
      </h1>

      <p className="text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}