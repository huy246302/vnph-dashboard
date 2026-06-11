import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import PlayerForm from "@/components/PlayerForm";
import { updatePlayer } from "@/lib/actions/players";
import { getPlayerById } from "@/lib/db/players";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPlayerPage({ params }: Props) {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) notFound();

  // Bind the id into the action so PlayerForm just calls action(formData)
  const action = updatePlayer.bind(null, id);

  return (
    <PageContainer>
      <PageHeader
        title={`Edit — ${player.full_name}`}
        description="Update the player's details then hit Save."
      />
      <PlayerForm
        action={action}
        submitLabel="Save Changes"
        initialData={{
          full_name:         player.full_name         ?? "",
          short_name:        player.short_name        ?? "",
          birth_date:        player.birth_date        ?? "",
          birth_place:       player.birth_place       ?? "",
          nationality:       player.nationality       ?? "Việt Nam",
          position:          player.position          ?? "",
          height_cm:         String(player.height_cm  ?? ""),
          weight_kg:         String(player.weight_kg  ?? ""),
          preferred_foot:    player.preferred_foot    ?? "",
          primary_era:       player.primary_era       ?? "",
          career_start_year: String(player.career_start_year ?? ""),
          career_end_year:   String(player.career_end_year   ?? ""),
          is_retired:        player.is_retired        ?? false,
          retired_year:      String(player.retired_year      ?? ""),
          bio:               player.bio               ?? "",
          legacy_bio:        player.legacy_bio        ?? "",
          playing_style:     player.playing_style     ?? "",
          profile_image_url: player.profile_image_url ?? "",
        }}
      />
    </PageContainer>
  );
}