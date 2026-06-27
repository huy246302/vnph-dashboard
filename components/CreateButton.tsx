"use client";

import { useState, useRef } from "react";
import Modal from "@/components/Modal";
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
  uploadBucket?: UploadBucket; // required when type === "file"
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
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFileChange(field: Field, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !field.uploadBucket) return;

    setUploadingField(field.name);
    setError(null);
    try {
      const url = await uploadImage(field.uploadBucket, file);
      setPreviews((prev) => ({ ...prev, [field.name]: url }));
      // Store the resulting URL in a hidden input so it submits with the form
      const hiddenInput = formRef.current?.elements.namedItem(field.name) as HTMLInputElement | null;
      if (hiddenInput) hiddenInput.value = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await action(new FormData(e.currentTarget));
      formRef.current?.reset();
      setPreviews({});
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
        <form ref={formRef} onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.name} className={field.span === 2 ? "col-span-2" : ""}>
                <label className={labelClass}>
                  {field.label} {field.required && "*"}
                </label>

                {field.type === "file" ? (
                  <div className="flex flex-col gap-2">
                    {/* Hidden input carries the resulting URL into the FormData */}
                    <input type="hidden" name={field.name} defaultValue={field.defaultValue} />
                    <label className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-colors">
                      <span className="text-base leading-none">📁</span>
                      <span>{previews[field.name] ? "Change image" : "Choose image"}</span>
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
                    {previews[field.name] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[field.name]}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                  </div>
                ) : field.type === "textarea" ? (
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
                    autoComplete={field.type === "password" ? "new-password" : "off"}
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
              disabled={loading || uploadingField !== null}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}