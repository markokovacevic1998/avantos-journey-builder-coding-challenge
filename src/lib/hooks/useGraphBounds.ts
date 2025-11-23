import { LayoutNode } from "@/src/lib/domain/types";

export function useGraphBounds(nodes: LayoutNode[]) {
  if (!nodes.length) {
    return {
      bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
      graphWidth: 0,
      graphHeight: 0,
    };
  }

  const xs = nodes.map((n) => n.left);
  const ys = nodes.map((n) => n.top);

  const bounds = {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };

  const PADDING = 200;

  const graphWidth = bounds.maxX - bounds.minX + PADDING * 2;
  const graphHeight = bounds.maxY - bounds.minY + PADDING * 2;

  return { bounds, graphWidth, graphHeight };
}
