"use client";

import { useState } from "react";

type StatsCardData = {
  era_label: string;
  year_from: string;
  year_to: string;
  is_verified: boolean;
  notes: string;
  speed: string; acceleration: string; stamina: string; balance: string; jumping: string; heading: string;
  attack: string; defense: string; aggression: string; reaction: string;
  passing: string; dribbling: string; ball_control: string; technique: string; finishing: string;
  shot_power: string; long_range: string; positioning: string;
  gk_catching: string; gk_diving: string; gk_reflexes: string; gk_reach: string;
};

type Props = {
  initialData?: Partial<StatsCardData>;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  isGoalkeeper: boolean;
};

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white";
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

const GROUPS: { title: string; fields: { key: keyof StatsCardData; label: string }[] }[] = [
  {
    title: "Physical",
    fields: [
      { key: "speed",        label: "Speed" },
      { key: "acceleration", label: "Acceleration" },
      { key: "stamina",      label: "Stamina" },
      { key: "balance",      label: "Balance" },
      { key: "jumping",      label: "Jumping" },
    ],
  },
  {
    title: "Technical",
    fields: [
      { key: "passing",      label: "Passing" },
      { key: "dribbling",    label: "Dribbling" },
      { key: "ball_control", label: "Ball Control" },
      { key: "technique",    label: "Technique" },
      { key: "finishing",    label: "Finishing" },
    ],
  },
  {
    title: "Mental",
    fields: [
      { key: "attack",     label: "Attack" },
      { key: "defense",    label: "Defense" },
      { key: "aggression", label: "Aggression" },
      { key: "reaction",   label: "Reaction" },
      { key: "positioning",label: "Positioning" },
    ],
  },
  {
    title: "Shooting",
    fields: [
      { key: "shot_power", label: "Shot Power" },
      { key: "long_range", label: "Long Range" },
      { key: "heading",    label: "Heading" },
    ],
  },
];

const GK_GROUP = {
  title: "Goalkeeper",
  fields: [
    { key: "gk_catching" as const, label: "Catching" },
    { key: "gk_diving"   as const, label: "Diving" },
    { key: "gk_reflexes" as const, label: "Reflexes" },
    { key: "gk_reach"    as const, label: "Reach" },
  ],
};

export default function StatsCardForm({ initialData, action, submitLabel, isGoalkeeper }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const blank: StatsCardData = {
    era_label: "", year_from: "", year_to: "", is_verified: false, notes: "",
    speed: "", acceleration: "", stamina: "", balance: "", jumping: "", heading: "",
    attack: "", defense: "", aggression: "", reaction: "",
    passing: "", dribbling: "", ball_control: "", technique: "", finishing: "",
    shot_power: "", long_range: "", positioning: "",
    gk_catching: "", gk_diving: "", gk_reflexes: "", gk_reach: "",
  };

  const [form, setForm] = useState<StatsCardData>({ ...blank, ...initialData });

  function set(field: keyof StatsCardData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      await action(fd);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const groups = isGoalkeeper ? [...GROUPS, GK_GROUP] : GROUPS;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
      {/* Card meta */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className={labelClass}>Era Label</label>
          <input className={inputClass} value={form.era_label}
            onChange={(e) => set("era_label", e.target.value)}
            placeholder="Peak Form 1994–1998" />
        </div>
        <div>
          <label className={labelClass}>Year From</label>
          <input type="number" className={inputClass} value={form.year_from}
            onChange={(e) => set("year_from", e.target.value)} placeholder="1994" />
        </div>
        <div>
          <label className={labelClass}>Year To</label>
          <input type="number" className={inputClass} value={form.year_to}
            onChange={(e) => set("year_to", e.target.value)} placeholder="1998" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea rows={2} className={inputClass} value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Optional context about this rating..." />
      </div>

      {/* Verified toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set("is_verified", !form.is_verified)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            form.is_verified ? "bg-green-600" : "bg-gray-200"
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            form.is_verified ? "translate-x-6" : "translate-x-1"
          }`} />
        </button>
        <label className="text-sm text-gray-700">Verified</label>
      </div>

      <hr className="border-gray-100" />

      {/* Attribute groups */}
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{group.title}</h3>
          <div className="grid grid-cols-5 gap-3">
            {group.fields.map((f) => (
              <div key={f.key}>
                <label className={labelClass}>{f.label}</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  className={inputClass}
                  value={form[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder="—"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}