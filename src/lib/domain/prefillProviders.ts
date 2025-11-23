import { GLOBAL_SOURCES } from "./globalSources";
import { getDirectUpstream, getTransitiveUpstream } from "./graphUtils";
import { ActionGraph, FormId, FormNode } from "./types";

export interface PrefillSourceProvider {
  id: string;
  label: string;
  getForms(graph: ActionGraph, formId: FormId): FormNode[];
  getFields?(form: FormNode): { id: string; label: string }[];
}

export const directUpstreamProvider: PrefillSourceProvider = {
  id: "direct",
  label: "Direct upstream nodes",

  getForms(graph, formId) {
    return getDirectUpstream(graph, formId);
  },
  getFields(form) {
    return form.fields.map((field) => ({
      id: field.id,
      label: field.label || field.id,
    }));
  },
};

export const transitiveUpstreamProvider: PrefillSourceProvider = {
  id: "transitive",
  label: "Transitive upstream nodes",

  getForms(graph, formId) {
    return getTransitiveUpstream(graph, formId);
  },
  getFields(form) {
    return form.fields.map((field) => ({
      id: field.id,
      label: field.label || field.id,
    }));
  },
};

export const globalProvider: PrefillSourceProvider = {
  id: "global",
  label: "Global sources",

  // Global source doesn't have forms, but we will return pseudo-form
  getForms() {
    return GLOBAL_SOURCES.map((src) => ({
      id: src.id,
      name: src.label,
      fields: [],
      upstreamIds: [],
      downstreamIds: [],
      formDefinitionId: "",
    }));
  },

  getFields() {
    return GLOBAL_SOURCES.map((src) => ({
      id: src.id,
      label: src.label,
    }));
  },
};

export const prefillProviders: PrefillSourceProvider[] = [
  directUpstreamProvider,
  transitiveUpstreamProvider,
  globalProvider,
];
