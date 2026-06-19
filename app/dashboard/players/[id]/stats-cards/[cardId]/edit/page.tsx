import { notFound } from "next/navigation";
import { getPlayerById } from "@/lib/db/players";
import { getStatsCardById } from "@/lib/db/player-stats-cards";
import { updateStatsCard } from "@/lib/actions/player-stats-cards";
import StatsCardForm from "@/components/StatsCardForm";
import PageHeader from "@/components/PageHeader";

type Props = {
  params: Promise<{ id: string; cardId: string }>;
};

function s(val: unknown) {
  return val === null || val === undefined ? "" : String(val);
}

export default async function EditStatsCardPage({ params }: Props) {
  const { id, cardId } = await params;

  const [player, card] = await Promise.all([
    getPlayerById(id),
    getStatsCardById(cardId),
  ]);

  if (!player || !card) notFound();

  const action = updateStatsCard.bind(null, id, cardId);
  const isGoalkeeper = player.position === "Thủ môn";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit — ${card.era_label ?? "Stats Card"}`}
        description="Update this player's attribute ratings."
      />
      <StatsCardForm
        action={action}
        submitLabel="Save Changes"
        isGoalkeeper={isGoalkeeper}
        initialData={{
          era_label:   card.era_label ?? "",
          year_from:   s(card.year_from),
          year_to:     s(card.year_to),
          is_verified: card.is_verified ?? false,
          notes:       card.notes ?? "",

          // Technical (14)
          corners:          s(card.corners),
          crossing:         s(card.crossing),
          dribbling:        s(card.dribbling),
          finishing:        s(card.finishing),
          first_touch:      s(card.first_touch),
          free_kick_taking: s(card.free_kick_taking),
          heading:          s(card.heading),
          long_shots:       s(card.long_shots),
          long_throws:      s(card.long_throws),
          marking:          s(card.marking),
          passing:          s(card.passing),
          penalty_taking:   s(card.penalty_taking),
          tackling:         s(card.tackling),
          technique:        s(card.technique),

          // Mental (14)
          aggression:    s(card.aggression),
          anticipation:  s(card.anticipation),
          bravery:       s(card.bravery),
          composure:     s(card.composure),
          concentration: s(card.concentration),
          decisions:     s(card.decisions),
          determination: s(card.determination),
          flair:         s(card.flair),
          leadership:    s(card.leadership),
          off_the_ball:  s(card.off_the_ball),
          positioning:   s(card.positioning),
          teamwork:      s(card.teamwork),
          vision:        s(card.vision),
          work_rate:     s(card.work_rate),

          // Physical (8)
          acceleration:    s(card.acceleration),
          agility:         s(card.agility),
          balance:         s(card.balance),
          jumping_reach:   s(card.jumping_reach),
          natural_fitness: s(card.natural_fitness),
          pace:            s(card.pace),
          stamina:         s(card.stamina),
          strength:        s(card.strength),

          // Goalkeeping (11)
          gk_aerial_reach:      s(card.gk_aerial_reach),
          gk_command_of_area:   s(card.gk_command_of_area),
          gk_communication:     s(card.gk_communication),
          gk_eccentricity:      s(card.gk_eccentricity),
          gk_first_touch:       s(card.gk_first_touch),
          gk_handling:          s(card.gk_handling),
          gk_kicking:           s(card.gk_kicking),
          gk_one_on_ones:       s(card.gk_one_on_ones),
          gk_passing:           s(card.gk_passing),
          gk_tendency_to_punch: s(card.gk_tendency_to_punch),
          gk_reflexes:          s(card.gk_reflexes),
          gk_rushing_out:       s(card.gk_rushing_out),
          gk_throwing:          s(card.gk_throwing),
        }}
      />
    </div>
  );
}