"use server";

import { createAdminClient } from "@/lib/supabase-admin";
// This file should live at: lib/actions/storage.ts

export type UploadBucket = "club-logos" | "national-team-logos" | "player-photos";

/**
 * Uploads an image file to the given Supabase Storage bucket and
 * returns its public URL. Use this from any form's submit handler
 * before saving the record — call this first, then pass the returned
 * URL into your existing create/update action as `logo_url` / `profile_image_url`.
 */
export async function uploadImage(bucket: UploadBucket, file: File): Promise<string> {
  const supabase = createAdminClient();

  // Build a safe, unique file name: timestamp + sanitized original name
  const ext = file.name.split(".").pop() ?? "png";
  const safeName = file.name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  const fileName = `${safeName}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Deletes an image from storage given its public URL.
 * Useful when replacing an existing logo/photo to avoid orphaned files.
 */
export async function deleteImage(bucket: UploadBucket, publicUrl: string): Promise<void> {
  const supabase = createAdminClient();

  // Extract the file name from the public URL
  const fileName = publicUrl.split(`/${bucket}/`).pop();
  if (!fileName) return;

  await supabase.storage.from(bucket).remove([fileName]);
}