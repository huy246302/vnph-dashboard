import { getPlayerNicknames } from "@/lib/db/player-nicknames";
import {
  createNickname,
  updateNickname,
  deleteNickname,
} from "@/lib/actions/player-nicknames";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";
import TableWrapper from "@/components/TableWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NicknamesPage({ params }: Props) {
  const { id } = await params;
  const nicknames = await getPlayerNicknames(id);

  const boundCreate = createNickname.bind(null, id);
  const boundDelete = deleteNickname.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Nicknames"
          description={`${nicknames.length} nickname${nicknames.length !== 1 ? "s" : ""}`}
        />
        <CreateButton
          label="Add Nickname"
          modalTitle="Add Nickname"
          action={boundCreate}
          fields={[
            {
              name: "nickname",
              label: "Nickname",
              required: true,
              span: 2,
              placeholder: "Cậu bé vàng",
            },
          ]}
        />
      </div>

      <TableWrapper>
        {nicknames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">No nicknames yet.</p>
            <p className="text-gray-300 text-xs mt-1">
              Click &quot;Add Nickname&quot; to get started.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Nickname</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {nicknames.map((n) => {
                const boundUpdate = updateNickname.bind(null, id, n.id);
                return (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {n.nickname}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        id={n.id}
                        label={n.nickname}
                        deleteAction={boundDelete}
                        updateAction={boundUpdate}
                        fields={[
                          {
                            name: "nickname",
                            label: "Nickname",
                            required: true,
                            span: 2,
                            defaultValue: n.nickname,
                            placeholder: "Cậu bé vàng",
                          },
                        ]}
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