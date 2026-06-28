/**
 * Shared date helpers — single source of truth for dd/mm/yyyy across the app.
 * The database always stores ISO format (yyyy-mm-dd), this file converts
 * between that and the dd/mm/yyyy format used everywhere in the UI.
 */

/** Converts an ISO date string (yyyy-mm-dd) to dd/mm/yyyy for display. */
export function toDisplayDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

/** Converts a dd/mm/yyyy string back to ISO format (yyyy-mm-dd) for storage. */
export function toISODate(displayDate: string | null | undefined): string {
  if (!displayDate) return "";
  const [day, month, year] = displayDate.split("/");
  if (!day || !month || !year) return "";
  // Pad day/month to 2 digits just in case
  const dd = day.padStart(2, "0");
  const mm = month.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** Validates a dd/mm/yyyy string is a real, well-formed date. */
export function isValidDisplayDate(displayDate: string): boolean {
  const match = displayDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1800 || year > 2100) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}