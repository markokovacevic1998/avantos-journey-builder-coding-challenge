import { ActionGraph, FormId, FormNode } from "./types";

const upstreamCache = new Map<FormId, FormNode[]>();
const transitiveCache = new Map<FormId, FormNode[]>();
const downstreamCache = new Map<FormId, FormNode[]>();

export function getDirectUpstream(graph: ActionGraph, formId: FormId) {
  const node = graph.formsById[formId];

  if (!node) return [];

  return node.upstreamIds.map((id) => graph.formsById[id]);
}

export function getDirectDownstream(graph: ActionGraph, formId: FormId) {
  const node = graph.formsById[formId];

  if (!node) return [];

  return node.downstreamIds.map((id) => graph.formsById[id]);
}

export function getAllUpstream(graph: ActionGraph, formId: FormId): FormNode[] {
  if (upstreamCache.has(formId)) {
    return upstreamCache.get(formId)!;
  }

  const visited = new Set<FormId>();
  const result: FormNode[] = [];

  function directFirstSearch(currentId: FormId) {
    const node = graph.formsById[currentId];

    if (!node) return;

    for (const parentId of node.upstreamIds) {
      if (!visited.has(parentId)) {
        visited.add(parentId);
        result.push(graph.formsById[parentId]);

        directFirstSearch(parentId);
      }
    }
  }

  directFirstSearch(formId);
  upstreamCache.set(formId, result);

  return result;
}

export function getAllDownstream(
  graph: ActionGraph,
  formId: FormId
): FormNode[] {
  if (downstreamCache.has(formId)) {
    return downstreamCache.get(formId)!;
  }

  const visited = new Set<FormId>();
  const result: FormNode[] = [];
  const queue: FormId[] = [...graph.formsById[formId].downstreamIds];

  while (queue.length > 0) {
    const id = queue.shift()!;

    if (!visited.has(id)) {
      visited.add(id);
      result.push(graph.formsById[id]);
      queue.push(...graph.formsById[id].downstreamIds);
    }
  }

  return result;
}

export function getTransitiveUpstream(graph: ActionGraph, formId: FormId) {
  if (transitiveCache.has(formId)) {
    return transitiveCache.get(formId);
  }

  const node = graph.formsById[formId];

  if (!node) return [];

  const directUpstream = getDirectUpstream(graph, formId);
  const allUpstream = getAllUpstream(graph, formId);

  const directIds = new Set(directUpstream.map((f) => f.id));

  return allUpstream.filter((f) => !directIds.has(f.id));
}
