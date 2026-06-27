import Image from "next/image";
import { getNationalTeams } from "@/lib/db/national-team";
import { createNationalTeam, updateNationalTeam, deleteNationalTeam } from "@/lib/actions/national-teams";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

const nationalTeamFields = [
  { name: "name",       label: "Team Name", required: true, span: 2 as const, placeholder: "Việt Nam" },
  { name: "short_name", label: "Short Name", placeholder: "VN" },
  { name: "country",    label: "Country",   required: true, placeholder: "Việt Nam" },
  { name: "logo_url",   label: "Logo",      span: 2 as const, type: "file" as const, uploadBucket: "national-team-logos" as const },
];

export default async function NationalTeamsPage() {
  const teams = await getNationalTeams();

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <PageHeader
          title="National Teams"
          description={`${teams.length} team${teams.length !== 1 ? "s" : ""} total`}
        />
        <CreateButton
          label="Add Team"
          modalTitle="Add National Team"
          action={createNationalTeam}
          fields={nationalTeamFields}
        />
      </div>

      <TableWrapper>
        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No national teams yet.</p>
            <p className="text-gray-300 text-xs mt-1">Click &quot;Add Team&quot; to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {team.logo_url ? (
                        <Image
                          src={team.logo_url}
                          alt={team.name}
                          width={28}
                          height={28}
                          className="object-contain rounded"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold shrink-0">
                          {team.short_name?.[0] ?? team.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{team.name}</p>
                        {team.short_name && (
                          <p className="text-xs text-gray-400">{team.short_name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{team.country}</td>
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      id={team.id}
                      label={team.name}
                      deleteAction={deleteNationalTeam}
                      updateAction={updateNationalTeam.bind(null, team.id)}
                      fields={nationalTeamFields.map((f) => ({
                        ...f,
                        defaultValue: String(team[f.name as keyof typeof team] ?? ""),
                      }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableWrapper>
    </PageContainer>
  );
}