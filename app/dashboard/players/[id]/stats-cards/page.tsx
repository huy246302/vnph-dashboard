import Link from "next/link";
import { getPlayerStatsCards } from "@/lib/db/player-stats-cards";
import { deleteStatsCard } from "@/lib/actions/player-stats-cards";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StatsCardsPage({ params }: Props) {
  const { id } = await params;
  const cards = await getPlayerStatsCards(id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Stats Cards"
          description={`${cards.length} card${cards.length !== 1 ? "s" : ""}`}
        />
        <Link
          href={`/dashboard/players/${id}/stats-cards/new`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add Card
        </Link>
      </div>

      <TableWrapper>
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No stats cards yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Card&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Era Label</th>
                <th className="px-4 py-3">Years</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cards.map((card) => {
                const boundDelete = deleteStatsCard.bind(null, id, card.id);
                return (
                  <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {card.era_label ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {card.year_from ?? "?"} – {card.year_to ?? "?"}
                    </td>
                    <td className="px-4 py-3">
                      {card.is_verified ? (
                        <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        id={card.id}
                        label={card.era_label ?? "this stats card"}
                        editHref={`/dashboard/players/${id}/stats-cards/${card.id}/edit`}
                        deleteAction={boundDelete}
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