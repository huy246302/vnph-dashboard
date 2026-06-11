import Link from "next/link";
import { getPlayers } from "@/lib/db/players";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import PlayersTable from "@/components/PlayerTable";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <PageHeader
          title="Players"
          description={`${players.length} player${players.length !== 1 ? "s" : ""} total`}
        />
        <Link
          href="/dashboard/players/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add Player
        </Link>
      </div>

      <PlayersTable players={players} />
    </PageContainer>
  );
}