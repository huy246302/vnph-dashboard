import { ReactNode } from "react";

export default function TableWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}