import { ActionGraph, FormId, FormNode } from "./types";

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
  return result;
}

export function getAllDownstream(
  graph: ActionGraph,
  formId: FormId
): FormNode[] {
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
