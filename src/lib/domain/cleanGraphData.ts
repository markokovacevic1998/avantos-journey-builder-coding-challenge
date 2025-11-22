import { ActionBlueprintGraphDescription, FormId, FormNode } from "./types";

export function cleanGraphData(rawData: ActionBlueprintGraphDescription) {
  const formsById: Record<FormId, FormNode> = {};

  for (const node of rawData.nodes) {
    const form = {
      id: node.id,
      name: node.data.name,
      fields: [],
      upstreamIds: node.data.prerequisites ?? [],
      downstreamIds: [],
      formDefinitionId: node.data.component_id,
    };

    formsById[node.id] = form;
  }

  for (const edge of rawData.edges) {
    if (formsById[edge.source]) {
      formsById[edge.source].downstreamIds.push(edge.target);
    }
  }

  const formDefById = Object.fromEntries(rawData.forms.map((f) => [f.id, f]));

  for (const formId in formsById) {
    const formDefinitionId = formsById[formId].formDefinitionId;
    const rawForm = formDefById[formDefinitionId];

    if (!rawForm) continue;

    for (const rawFieldKey of Object.keys(rawForm.field_schema.properties)) {
      const property = rawForm.field_schema.properties[rawFieldKey];

      const field = {
        id: rawFieldKey,
        label: property.title || "",
        type: property.avantos_type,
      };
      formsById[formId].fields.push(field);
    }
  }

  return {
    formsById,
  };
}
