"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function revalidate(playerId: string) {
  revalidatePath(`/dashboard/players/${playerId}/career-events`);
}

function num(val: FormDataEntryValue | null) {
  return val && val !== "" ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

export async function createCareerEvent(playerId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("career_events").insert({
    player_id:   playerId,
    event_year:  num(formData.get("event_year")),
    event_month: num(formData.get("event_month")),
    title:       formData.get("title") as string,
    description: str(formData.get("description")),
    event_type:  str(formData.get("event_type")),
  });

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function updateCareerEvent(playerId: string, eventId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("career_events")
    .update({
      event_year:  num(formData.get("event_year")),
      event_month: num(formData.get("event_month")),
      title:       formData.get("title") as string,
      description: str(formData.get("description")),
      event_type:  str(formData.get("event_type")),
    })
    .eq("id", eventId);

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function deleteCareerEvent(playerId: string, eventId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("career_events").delete().eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}