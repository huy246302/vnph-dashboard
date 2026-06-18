import { notFound } from "next/navigation";
import { getPlayerById } from "@/lib/db/players";
import { createStatsCard } from "@/lib/actions/player-stats-cards";
import StatsCardForm from "@/components/StatsCardForm";
import PageHeader from "@/components/PageHeader";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewStatsCardPage({ params }: Props) {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) notFound();

  const action = createStatsCard.bind(null, id);
  const isGoalkeeper = player.position === "Thủ môn";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Stats Card"
        description="Rate this player's attributes for a specific era of their career."
      />
      <StatsCardForm
        action={action}
        submitLabel="Save Card"
        isGoalkeeper={isGoalkeeper}
      />
    </div>
  );
}