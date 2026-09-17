export type RequirementLayout = { y: number; height: number };

export function calculateRequirementScrollOffset(
  layouts: RequirementLayout[],
  viewportHeight: number,
  contentHeight: number,
): number | null {
  if (layouts.length === 0 || viewportHeight <= 0) return null;

  const top = Math.min(...layouts.map((layout) => layout.y));
  const bottom = Math.max(...layouts.map((layout) => layout.y + layout.height));
  const target = (top + bottom) / 2 - viewportHeight / 2;
  const maxOffset = Math.max(0, contentHeight - viewportHeight);
  return Math.min(maxOffset, Math.max(0, target));
}
