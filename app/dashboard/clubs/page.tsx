import { getClubs } from "@/lib/db/clubs";

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <div>
      <h1>Clubs</h1>

      {clubs.map((club) => (
        <div key={club.id}>
          {club.name}
        </div>
      ))}
    </div>
  );
}