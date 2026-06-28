"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/actions/storage";
import DateInput from "@/components/DateInput";
import { toDisplayDate, toISODate } from "@/lib/date-helpers";

type PlayerFormData = {
  full_name: string;
  short_name: string;
  birth_date: string;
  birth_place: string;
  nationality: string;
  position: string;
  height_cm: string;
  weight_kg: string;
  preferred_foot: string;
  primary_era: string;
  career_start_year: string;
  career_end_year: string;
  is_retired: boolean;
  retired_year: string;
  bio: string;
  legacy_bio: string;
  playing_style: string;
  profile_image_url: string;
};

type Props = {
  initialData?: Partial<PlayerFormData>;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

const TABS = ["Identity", "Physical", "Career", "Media"] as const;
type Tab = (typeof TABS)[number];

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white";
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

const ERA_OPTIONS = [
  "pre-1930s","1930s","1940s","1950s","1960s",
  "1970s","1980s","1990s","2000s","2010s","2020s",
];

export default function PlayerForm({ initialData, action, submitLabel }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Identity");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState<PlayerFormData>({
    full_name:         initialData?.full_name         ?? "",
    short_name:        initialData?.short_name        ?? "",
    birth_date:        toDisplayDate(initialData?.birth_date) ?? "",
    birth_place:       initialData?.birth_place       ?? "",
    nationality:       initialData?.nationality       ?? "Việt Nam",
    position:          initialData?.position          ?? "",
    height_cm:         initialData?.height_cm         ?? "",
    weight_kg:         initialData?.weight_kg         ?? "",
    preferred_foot:    initialData?.preferred_foot    ?? "",
    primary_era:       initialData?.primary_era       ?? "",
    career_start_year: initialData?.career_start_year ?? "",
    career_end_year:   initialData?.career_end_year   ?? "",
    is_retired:        initialData?.is_retired        ?? false,
    retired_year:      initialData?.retired_year      ?? "",
    bio:               initialData?.bio               ?? "",
    legacy_bio:        initialData?.legacy_bio        ?? "",
    playing_style:     initialData?.playing_style     ?? "",
    profile_image_url: initialData?.profile_image_url ?? "",
  });

  function set(field: keyof PlayerFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);
    try {
      const url = await uploadImage("player-photos", file);
      set("profile_image_url", url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSubmit() {
    if (!form.full_name.trim()) {
      setActiveTab("Identity");
      setError("Full name is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "birth_date") {
          fd.append(k, toISODate(v as string));
        } else {
          fd.append(k, String(v));
        }
      });
      await action(fd);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* IDENTITY */}
        {activeTab === "Identity" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
              <input className={inputClass} value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className={labelClass}>Short Name</label>
              <input className={inputClass} value={form.short_name}
                onChange={(e) => set("short_name", e.target.value)}
                placeholder="Văn A" />
            </div>
            <div>
              <label className={labelClass}>Nationality</label>
              <input className={inputClass} value={form.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                placeholder="Việt Nam" />
            </div>
            <div>
              <label className={labelClass}>Birth Date</label>
              <DateInput
                name="birth_date"
                value={form.birth_date}
                onChange={(v) => set("birth_date", v)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Birth Place</label>
              <input className={inputClass} value={form.birth_place}
                onChange={(e) => set("birth_place", e.target.value)}
                placeholder="Hà Nội" />
            </div>
            <div>
              <label className={labelClass}>Position</label>
              <select className={inputClass} value={form.position}
                onChange={(e) => set("position", e.target.value)}>
                <option value="">— Select —</option>
                {["Thủ môn","Hậu vệ","Tiền vệ","Tiền đạo"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* PHYSICAL */}
        {activeTab === "Physical" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Height (cm)</label>
              <input type="number" className={inputClass} value={form.height_cm}
                onChange={(e) => set("height_cm", e.target.value)} placeholder="175" />
            </div>
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input type="number" className={inputClass} value={form.weight_kg}
                onChange={(e) => set("weight_kg", e.target.value)} placeholder="70" />
            </div>
            <div>
              <label className={labelClass}>Preferred Foot</label>
              <select className={inputClass} value={form.preferred_foot}
                onChange={(e) => set("preferred_foot", e.target.value)}>
                <option value="">— Select —</option>
                {["left","right","both"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Primary Era</label>
              <select className={inputClass} value={form.primary_era}
                onChange={(e) => set("primary_era", e.target.value)}>
                <option value="">— Select —</option>
                {ERA_OPTIONS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* CAREER */}
        {activeTab === "Career" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Career Start Year</label>
              <input type="number" className={inputClass} value={form.career_start_year}
                onChange={(e) => set("career_start_year", e.target.value)} placeholder="1990" />
            </div>
            <div>
              <label className={labelClass}>Career End Year</label>
              <input type="number" className={inputClass} value={form.career_end_year}
                onChange={(e) => set("career_end_year", e.target.value)} placeholder="2005" />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => set("is_retired", !form.is_retired)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.is_retired ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.is_retired ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
              <label className="text-sm text-gray-700">Retired</label>
            </div>
            {form.is_retired && (
              <div>
                <label className={labelClass}>Retirement Year</label>
                <input type="number" className={inputClass} value={form.retired_year}
                  onChange={(e) => set("retired_year", e.target.value)} placeholder="2005" />
              </div>
            )}
            <div className="col-span-2">
              <label className={labelClass}>Bio</label>
              <textarea rows={3} className={inputClass} value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Short public biography..." />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Legacy Bio</label>
              <textarea rows={4} className={inputClass} value={form.legacy_bio}
                onChange={(e) => set("legacy_bio", e.target.value)}
                placeholder="Longer editorial write-up for legend profile..." />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Playing Style</label>
              <textarea rows={3} className={inputClass} value={form.playing_style}
                onChange={(e) => set("playing_style", e.target.value)}
                placeholder="Describe the player's style of play..." />
            </div>
          </div>
        )}

        {/* MEDIA */}
        {activeTab === "Media" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Profile Photo</label>
              <label className="flex items-center justify-center gap-2 w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-colors">
                <span className="text-base leading-none">📁</span>
                <span>{form.profile_image_url ? "Change photo" : "Choose photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {uploadingPhoto && (
                <p className="text-xs text-blue-500 mt-2">Uploading...</p>
              )}
            </div>
            {form.profile_image_url && (
              <div className="col-span-2">
                <p className={labelClass}>Preview</p>
                <img
                  src={form.profile_image_url}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={loading || uploadingPhoto}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}