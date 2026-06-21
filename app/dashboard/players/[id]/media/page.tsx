import Image from "next/image";
import { getPlayerMedia } from "@/lib/db/player-media";
import {
  createPlayerMedia,
  updatePlayerMedia,
  deletePlayerMedia,
} from "@/lib/actions/player-media";
import CreateButton from "@/components/CreateButton";
import RowActions from "@/components/RowActions";
import PageHeader from "@/components/PageHeader";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PlayerMediaPage({ params }: Props) {
  const { id } = await params;
  const media = await getPlayerMedia(id);

  const boundCreate = createPlayerMedia.bind(null, id);
  const boundDelete = deletePlayerMedia.bind(null, id);

  const fields = [
    { name: "image_url",  label: "Image URL", required: true, span: 2 as const, placeholder: "https://..." },
    { name: "caption",    label: "Caption",   span: 2 as const, placeholder: "Ăn mừng bàn thắng tại V.League 2013" },
    { name: "year",       label: "Year",      type: "number" as const },
    { name: "media_type", label: "Type",      type: "select" as const, options: ["photo", "video_thumbnail"] },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Media"
          description={`${media.length} item${media.length !== 1 ? "s" : ""}`}
        />
        <CreateButton
          label="Add Media"
          modalTitle="Add Media"
          action={boundCreate}
          fields={fields}
        />
      </div>

      {media.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 text-sm">No media yet.</p>
          <p className="text-gray-300 text-xs mt-1">Click &quot;Add Media&quot; to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => {
            const boundUpdate = updatePlayerMedia.bind(null, id, item.id);
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image
                    src={item.image_url}
                    alt={item.caption ?? "Player media"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col gap-1 flex-1">
                  {item.caption && (
                    <p className="text-sm text-gray-800 line-clamp-2">{item.caption}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-xs text-gray-400">{item.year ?? "—"}</span>
                    <RowActions
                      id={item.id}
                      label={item.caption ?? "this media item"}
                      deleteAction={boundDelete}
                      updateAction={boundUpdate}
                      fields={fields.map((f) => ({
                        ...f,
                        defaultValue: String(item[f.name as keyof typeof item] ?? ""),
                      }))}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}