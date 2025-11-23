import { ActionGraph, FormNode, LayoutNode } from "../domain/types";

interface UseGraphLayoutReturn {
  layoutNodes: LayoutNode[];
  layoutError?: string;
}

const NODE_W = 180;
const NODE_H = 80;
const COL_GAP = 280;
const ROW_GAP = 170;
const PORT_SIZE = 12;

export function useGraphLayout({
  forms,
  graph,
}: {
  forms: FormNode[];
  graph: ActionGraph;
}): UseGraphLayoutReturn {
  if (!forms || !graph) {
    return {
      layoutNodes: [],
      layoutError: "Missing data in useGraphLayout hook",
    };
  }

  const levels = new Map<string, number>();
  const roots = forms.filter((f) => f.upstreamIds.length === 0);

  const queue: { id: string; level: number }[] = roots.map((r) => ({
    id: r.id,
    level: 0,
  }));

  for (const r of roots) {
    levels.set(r.id, 0);
  }

  const byLevel: Record<number, FormNode[]> = {};

  while (queue.length) {
    const current = queue.shift();
    if (!current) break;

    const { id, level } = current;
    const node = graph.formsById[id];
    if (!node) continue;

    if (!byLevel[level]) byLevel[level] = [];
    byLevel[level].push(node);

    for (const child of node.downstreamIds) {
      const nextLevel = level + 1;
      const existingLevel = levels.get(child);

      if (existingLevel === undefined || nextLevel > existingLevel) {
        levels.set(child, nextLevel);
        queue.push({ id: child, level: nextLevel });
      }
    }
  }

  const maxLevel = Math.max(...levels.values());
  const layoutNodes: LayoutNode[] = [];

  for (let level = 0; level <= maxLevel; level++) {
    const group = byLevel[level] || [];
    const count = group.length;

    group.forEach((node, index) => {
      const x = level * COL_GAP;
      const y = index * ROW_GAP - ((count - 1) * ROW_GAP) / 2;

      const portOffset = PORT_SIZE / 2;

      layoutNodes.push({
        ...node,
        x,
        y,
        left: x,
        top: y,

        leftPortX: x - portOffset,
        leftPortY: y + NODE_H / 2,

        rightPortX: x + NODE_W + portOffset,
        rightPortY: y + NODE_H / 2,
      });
    });
  }

  return {
    layoutNodes,
    layoutError: "",
  };
}
