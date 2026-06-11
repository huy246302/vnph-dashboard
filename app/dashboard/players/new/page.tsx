import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import PlayerForm from "@/components/PlayerForm";
import { createPlayer } from "@/lib/actions/players";

export default function NewPlayerPage() {
  return (
    <PageContainer>
      <PageHeader
        title="New Player"
        description="Fill in the player details across all tabs then hit Save."
      />
      <PlayerForm action={createPlayer} submitLabel="Save Player" />
    </PageContainer>
  );
}