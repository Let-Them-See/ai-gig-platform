/**
 * Skills are stored as JSON strings in SQLite.
 * These helpers convert between string[] and JSON string storage.
 */

export function parseSkills(raw: string | string[] | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeSkills(skills: string[]): string {
  return JSON.stringify(skills);
}

export function parseJson(raw: string | Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === 'object') return raw as Record<string, unknown>;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function serializeJson(obj: unknown): string {
  return JSON.stringify(obj);
}
