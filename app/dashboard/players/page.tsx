import { getPlayers } from "@/lib/db/players";

export default async function PlayersPage() {
    const players = await getPlayers();

    return (
        <div className="px-8 py-10 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold">Players</h1>
                <p className="text-gray-500 text-sm">All registered players</p>
            </div>
            <hr className="border-gray-400"/>
            <table className="w-full text-sm text-left border border-gray-600 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-800 uppercase text-xs">
                    <tr>
                        <th className="py-4 px-3">Name</th>
                        <th className="py-4 px-3">Position</th>
                        <th className="py-4 px-3">Club</th>
                        <th className="py-4 px-3">Birth Date</th>
                        <th className="py-4 px-3">Height</th>
                        <th className="py-4 px-3">Preferred foot</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <tr key={player.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-3">{player.full_name}</td>
                            <td className="py-4 px-3">{player.position}</td>
                            <td className="py-4 px-3">{player.current_club}</td>
                            <td className="py-4 px-3">{player.birth_date}</td>
                            <td className="py-4 px-3">{player.height_cm}</td>
                            <td className="py-4 px-3">{player.preferred_foot}</td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
