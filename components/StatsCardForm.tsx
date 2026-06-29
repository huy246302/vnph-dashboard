"use client";

import { useState } from "react";

type StatsCardData = {
  era_label: string;
  year_from: string;
  year_to: string;
  is_verified: boolean;
  notes: string;

  // Technical (14)
  corners: string; crossing: string; dribbling: string; finishing: string;
  first_touch: string; free_kick_taking: string; heading: string;
  long_shots: string; long_throws: string; marking: string; passing: string;
  penalty_taking: string; tackling: string; technique: string;

  // Mental (14)
  aggression: string; anticipation: string; bravery: string; composure: string;
  concentration: string; decisions: string; determination: string; flair: string;
  leadership: string; off_the_ball: string; positioning: string; teamwork: string;
  vision: string; work_rate: string;

  // Physical (8)
  acceleration: string; agility: string; balance: string; jumping_reach: string;
  natural_fitness: string; pace: string; stamina: string; strength: string;

  // Goalkeeping (13 incl. gk_first_touch/gk_passing)
  gk_aerial_reach: string; gk_command_of_area: string; gk_communication: string;
  gk_eccentricity: string; gk_first_touch: string; gk_handling: string;
  gk_kicking: string; gk_one_on_ones: string; gk_passing: string;
  gk_tendency_to_punch: string; gk_reflexes: string; gk_rushing_out: string;
  gk_throwing: string;

  // Personality (7)
  ambition: string; controversy: string; loyalty: string; pressure: string;
  professionalism: string; sportsmanship: string; temperament: string;

  // Hidden Performance (6)
  consistency: string; dirtiness: string; important_matches: string;
  injury_proneness: string; adaptability: string; versatility: string;
};

type Props = {
  initialData?: Partial<StatsCardData>;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  isGoalkeeper: boolean;
};

const inputClass =
  "w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white";
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

type FieldDef = { key: keyof StatsCardData; label: string };

const TECHNICAL: FieldDef[] = [
  { key: "corners",          label: "Corners" },
  { key: "crossing",         label: "Crossing" },
  { key: "dribbling",        label: "Dribbling" },
  { key: "finishing",        label: "Finishing" },
  { key: "first_touch",      label: "First Touch" },
  { key: "free_kick_taking", label: "Free Kick Taking" },
  { key: "heading",          label: "Heading" },
  { key: "long_shots",       label: "Long Shots" },
  { key: "long_throws",      label: "Long Throws" },
  { key: "marking",          label: "Marking" },
  { key: "passing",          label: "Passing" },
  { key: "penalty_taking",   label: "Penalty Taking" },
  { key: "tackling",         label: "Tackling" },
  { key: "technique",        label: "Technique" },
];

const MENTAL: FieldDef[] = [
  { key: "aggression",    label: "Aggression" },
  { key: "anticipation",  label: "Anticipation" },
  { key: "bravery",       label: "Bravery" },
  { key: "composure",     label: "Composure" },
  { key: "concentration", label: "Concentration" },
  { key: "decisions",     label: "Decisions" },
  { key: "determination", label: "Determination" },
  { key: "flair",         label: "Flair" },
  { key: "leadership",    label: "Leadership" },
  { key: "off_the_ball",  label: "Off the Ball" },
  { key: "positioning",   label: "Positioning" },
  { key: "teamwork",      label: "Teamwork" },
  { key: "vision",        label: "Vision" },
  { key: "work_rate",     label: "Work Rate" },
];

const PHYSICAL: FieldDef[] = [
  { key: "acceleration",    label: "Acceleration" },
  { key: "agility",         label: "Agility" },
  { key: "balance",         label: "Balance" },
  { key: "jumping_reach",   label: "Jumping Reach" },
  { key: "natural_fitness", label: "Natural Fitness" },
  { key: "pace",            label: "Pace" },
  { key: "stamina",         label: "Stamina" },
  { key: "strength",        label: "Strength" },
];

const GOALKEEPING: FieldDef[] = [
  { key: "gk_aerial_reach",      label: "Aerial Reach" },
  { key: "gk_command_of_area",   label: "Command of Area" },
  { key: "gk_communication",     label: "Communication" },
  { key: "gk_eccentricity",      label: "Eccentricity" },
  { key: "gk_first_touch",       label: "First Touch" },
  { key: "gk_handling",          label: "Handling" },
  { key: "gk_kicking",           label: "Kicking" },
  { key: "gk_one_on_ones",       label: "One on Ones" },
  { key: "gk_passing",           label: "Passing" },
  { key: "gk_tendency_to_punch", label: "Tendency to Punch" },
  { key: "gk_reflexes",          label: "Reflexes" },
  { key: "gk_rushing_out",       label: "Rushing Out" },
  { key: "gk_throwing",          label: "Throwing" },
];

const GROUPS: { title: string; color: string; fields: FieldDef[] }[] = [
  { title: "Technical", color: "text-blue-700",   fields: TECHNICAL },
  { title: "Mental",    color: "text-purple-700", fields: MENTAL },
  { title: "Physical",  color: "text-green-700",  fields: PHYSICAL },
];

const GK_GROUP = { title: "Goalkeeping", color: "text-orange-700", fields: GOALKEEPING };

const PERSONALITY: FieldDef[] = [
  { key: "ambition",        label: "Ambition" },
  { key: "controversy",     label: "Controversy" },
  { key: "loyalty",         label: "Loyalty" },
  { key: "pressure",        label: "Pressure" },
  { key: "professionalism", label: "Professionalism" },
  { key: "sportsmanship",   label: "Sportsmanship" },
  { key: "temperament",     label: "Temperament" },
];

const HIDDEN_PERFORMANCE: FieldDef[] = [
  { key: "consistency",       label: "Consistency" },
  { key: "dirtiness",         label: "Dirtiness" },
  { key: "important_matches", label: "Important Matches" },
  { key: "injury_proneness",  label: "Injury Proneness" },
  { key: "adaptability",      label: "Adaptability" },
  { key: "versatility",       label: "Versatility" },
];

const PERSONALITY_GROUP = { title: "Personality", color: "text-pink-700", fields: PERSONALITY };
const HIDDEN_GROUP = { title: "Hidden Performance", color: "text-slate-700", fields: HIDDEN_PERFORMANCE };

const blank: StatsCardData = {
  era_label: "", year_from: "", year_to: "", is_verified: false, notes: "",
  corners: "", crossing: "", dribbling: "", finishing: "", first_touch: "",
  free_kick_taking: "", heading: "", long_shots: "", long_throws: "", marking: "",
  passing: "", penalty_taking: "", tackling: "", technique: "",
  aggression: "", anticipation: "", bravery: "", composure: "", concentration: "",
  decisions: "", determination: "", flair: "", leadership: "", off_the_ball: "",
  positioning: "", teamwork: "", vision: "", work_rate: "",
  acceleration: "", agility: "", balance: "", jumping_reach: "",
  natural_fitness: "", pace: "", stamina: "", strength: "",
  gk_aerial_reach: "", gk_command_of_area: "", gk_communication: "", gk_eccentricity: "",
  gk_first_touch: "", gk_handling: "", gk_kicking: "", gk_one_on_ones: "",
  gk_passing: "", gk_tendency_to_punch: "", gk_reflexes: "", gk_rushing_out: "",
  gk_throwing: "",
  ambition: "", controversy: "", loyalty: "", pressure: "",
  professionalism: "", sportsmanship: "", temperament: "",
  consistency: "", dirtiness: "", important_matches: "",
  injury_proneness: "", adaptability: "", versatility: "",
};

export default function StatsCardForm({ initialData, action, submitLabel, isGoalkeeper }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [form, setForm]       = useState<StatsCardData>({ ...blank, ...initialData });

  function set(field: keyof StatsCardData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Clamps a numeric attribute input to the 1-100 range as the user types.
  // Allows an empty string (so the field can be cleared) and rejects
  // anything non-numeric or out of bounds.
  function setAttribute(field: keyof StatsCardData, raw: string) {
    if (raw === "") {
      set(field, "");
      return;
    }
    const digitsOnly = raw.replace(/[^\d]/g, "");
    if (digitsOnly === "") {
      set(field, "");
      return;
    }
    let num = parseInt(digitsOnly, 10);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    set(field, String(num));
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

  const groups = isGoalkeeper
    ? [...GROUPS, GK_GROUP, PERSONALITY_GROUP, HIDDEN_GROUP]
    : [...GROUPS, PERSONALITY_GROUP, HIDDEN_GROUP];

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
          <h3 className={`text-sm font-semibold mb-3 ${group.color}`}>
            {group.title} <span className="text-gray-400 font-normal">({group.fields.length})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {group.fields.map((f) => (
              <div key={f.key}>
                <label className={labelClass}>{f.label}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  className={inputClass}
                  value={form[f.key] as string}
                  onChange={(e) => setAttribute(f.key, e.target.value)}
                  onBlur={(e) => setAttribute(f.key, e.target.value)}
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