"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import Modal from "@/components/Modal";
import DateInput from "@/components/DateInput";
import { toDisplayDate, toISODate } from "@/lib/date-helpers";
import { uploadImage, type UploadBucket } from "@/lib/actions/storage";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "password" | "file";
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  span?: 2;
  uploadBucket?: UploadBucket;
};

type Props = {
  id: string;
  label?: string;
  editHref?: string;
  fields?: Field[];
  deleteAction: (id: string) => Promise<void>;
  updateAction?: (formData: FormData) => Promise<void>;
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
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [dateValues, setDateValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields?.forEach((f) => {
      if (f.type === "date" && f.defaultValue) {
        initial[f.name] = toDisplayDate(f.defaultValue);
      }
    });
    return initial;
  });
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFileChange(field: Field, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !field.uploadBucket) return;

    setUploadingField(field.name);
    setError(null);
    try {
      const url = await uploadImage(field.uploadBucket, file);
      setPreviews((prev) => ({ ...prev, [field.name]: url }));
      const hiddenInput = formRef.current?.elements.namedItem(field.name) as HTMLInputElement | null;
      if (hiddenInput) hiddenInput.value = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingField(null);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!updateAction) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      fields?.forEach((field) => {
        if (field.type === "date") {
          const displayValue = dateValues[field.name] ?? "";
          formData.set(field.name, toISODate(displayValue));
        }
      });
      await updateAction(formData);
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

      {!editHref && fields && updateAction && (
        <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Record">
          <form ref={formRef} onSubmit={handleUpdate} autoComplete="off" className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {fields.map((field) => (
                <div key={field.name} className={field.span === 2 ? "col-span-2" : ""}>
                  <label className={labelClass}>
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>

                  {field.type === "file" ? (
                    <div className="flex flex-col gap-2">
                      <input type="hidden" name={field.name} defaultValue={field.defaultValue} />
                      <label className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-colors">
                        <span className="text-base leading-none">📁</span>
                        <span>{previews[field.name] || field.defaultValue ? "Change image" : "Choose image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(field, e)}
                          className="hidden"
                        />
                      </label>
                      {uploadingField === field.name && (
                        <p className="text-xs text-blue-500">Uploading...</p>
                      )}
                      {(previews[field.name] || field.defaultValue) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previews[field.name] || field.defaultValue}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                  ) : field.type === "date" ? (
                    <DateInput
                      name={field.name}
                      value={dateValues[field.name] ?? ""}
                      onChange={(v) => setDateValues((prev) => ({ ...prev, [field.name]: v }))}
                      required={field.required}
                      className={inputClass}
                    />
                  ) : field.type === "textarea" ? (
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
              <button type="submit" disabled={loading || uploadingField !== null}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

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