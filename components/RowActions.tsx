"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "@/components/Modal";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "password";
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  span?: 2;
};

type Props = {
  id: string;
  label?: string;
  // Pass editHref to link to a dedicated edit page (e.g. players)
  // Pass fields + updateAction to use the inline modal (e.g. clubs, trophies)
  editHref?: string;
  fields?: Field[];
  deleteAction: (id: string) => Promise<void>;
  updateAction?: (id: string, formData: FormData) => Promise<void>;
};

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

export default function RowActions({
  id, label, editHref, fields, deleteAction, updateAction,
}: Props) {
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!updateAction) return;
    setLoading(true);
    setError(null);
    try {
      await updateAction(id, new FormData(e.currentTarget));
      setEditOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteAction(id);
      setDeleteOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {/* Edit — link or modal depending on whether editHref is provided */}
        {editHref ? (
          <Link
            href={editHref}
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit
          </Link>
        ) : (
          <button
            onClick={() => { setError(null); setEditOpen(true); }}
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => { setError(null); setDeleteOpen(true); }}
          className="px-3 py-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Edit Modal — only rendered when using inline edit */}
      {!editHref && fields && updateAction && (
        <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Record">
          <form onSubmit={handleUpdate} autoComplete="off" className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {fields.map((field) => (
                <div key={field.name} className={field.span === 2 ? "col-span-2" : ""}>
                  <label className={labelClass}>
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea name={field.name} rows={3} placeholder={field.placeholder}
                      defaultValue={field.defaultValue} className={inputClass} />
                  ) : field.type === "select" ? (
                    <select name={field.name} defaultValue={field.defaultValue ?? ""} className={inputClass}>
                      <option value="">— Select —</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input name={field.name} type={field.type ?? "text"} required={field.required}
                      placeholder={field.placeholder} defaultValue={field.defaultValue}
                      autoComplete={field.type === "password" ? "new-password" : "off"}
                      className={inputClass} />
                  )}
                </div>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setEditOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            {label ? <span className="font-medium text-gray-900">&quot;{label}&quot;</span> : "this record"}?
            {" "}This action cannot be undone.
          </p>
          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={loading}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition-colors">
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}