import { getPlayerCareerEvents } from "@/lib/db/career-events";
import {
  createCareerEvent,
  updateCareerEvent,
  deleteCareerEvent,
} from "@/lib/actions/career-events";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

const EVENT_TYPE_OPTIONS = ["transfer", "debut", "trophy", "award", "injury", "retirement", "other"];

const EVENT_TYPE_COLORS: Record<string, string> = {
  transfer:   "bg-blue-50 text-blue-600",
  debut:      "bg-green-50 text-green-600",
  trophy:     "bg-yellow-50 text-yellow-700",
  award:      "bg-purple-50 text-purple-600",
  injury:     "bg-red-50 text-red-600",
  retirement: "bg-gray-100 text-gray-500",
  other:      "bg-gray-50 text-gray-500",
};

export default async function CareerEventsPage({ params }: Props) {
  const { id } = await params;
  const events = await getPlayerCareerEvents(id);

  const boundCreate = createCareerEvent.bind(null, id);
  const boundDelete = deleteCareerEvent.bind(null, id);

  const fields = [
    { name: "title",       label: "Title",       required: true, span: 2 as const, placeholder: "Gia nhập CLB Hà Nội FC" },
    { name: "event_year",  label: "Year",        required: true, type: "number" as const },
    { name: "event_month", label: "Month (1-12)", type: "number" as const },
    { name: "event_type",  label: "Type",        type: "select" as const, options: EVENT_TYPE_OPTIONS },
    { name: "description", label: "Description", type: "textarea" as const, span: 2 as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Career Events"
          description={`${events.length} event${events.length !== 1 ? "s" : ""}`}
        />
        <CreateButton
          label="Add Event"
          modalTitle="Add Career Event"
          action={boundCreate}
          fields={fields}
        />
      </div>

      <TableWrapper>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No career events yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Event&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => {
                const boundUpdate = updateCareerEvent.bind(null, id, event.id);
                return (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">
                      {event.event_year}{event.event_month ? `/${event.event_month}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-gray-400 max-w-xs truncate">{event.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {event.event_type ? (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${EVENT_TYPE_COLORS[event.event_type] ?? "bg-gray-50 text-gray-500"}`}>
                          {event.event_type}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        id={event.id}
                        label={event.title}
                        deleteAction={boundDelete}
                        updateAction={boundUpdate}
                        fields={fields.map((f) => ({
                          ...f,
                          defaultValue: String(event[f.name as keyof typeof event] ?? ""),
                        }))}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </TableWrapper>
    </div>
  );
}