export function normalizeRouteId(rawId: string | string[] | undefined): string | null {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  const normalized = value?.trim();

  return normalized && normalized.length <= 200 ? normalized : null;
}
