"use client";

import { useState, useRef } from "react";
import Modal from "@/components/Modal";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  span?: 2;
};

type Props = {
  label: string;
  modalTitle: string;
  fields: Field[];
  action: (formData: FormData) => Promise<void>;
};

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

export default function CreateButton({ label, modalTitle, fields, action }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await action(new FormData(e.currentTarget));
      formRef.current?.reset();
      setOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <span className="text-lg leading-none">+</span> {label}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={modalTitle}>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.name} className={field.span === 2 ? "col-span-2" : ""}>
                <label className={labelClass}>
                  {field.label} {field.required && "*"}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={3}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                ) : field.type === "select" ? (
                  <select name={field.name} className={inputClass} defaultValue="">
                    <option value="">— Select —</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type ?? "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? "Saving..." : `Save`}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}