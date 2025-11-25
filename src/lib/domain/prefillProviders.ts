import { GLOBAL_FORMS } from "./globalSources";
import {
  getDirectUpstream,
  getTransitiveUpstream,
  toFieldSummary,
} from "./graphUtils";
import { ActionGraph, PrefillFormNode } from "./types";

export interface PrefillSourceProvider {
  id: string;
  label: string;
  getForms: (
    graph: ActionGraph,
    formId: string
  ) => PrefillFormNode[] | undefined;
  getFields?: (form: PrefillFormNode) => { id: string; label: string }[];
}

export const directUpstreamProvider: PrefillSourceProvider = {
  id: "direct",
  label: "Direct upstream nodes",

  getForms(graph, formId) {
    return getDirectUpstream(graph, formId).map((form) => ({
      id: form.id,
      name: form.name,
      fields: toFieldSummary(form),
    }));
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
    return getTransitiveUpstream(graph, formId)?.map((form) => ({
      id: form.id,
      name: form.name,
      fields: toFieldSummary(form),
    }));
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

  getForms: () => GLOBAL_FORMS,

  getFields: (form) => form.fields,
};

export const prefillProviders: PrefillSourceProvider[] = [
  directUpstreamProvider,
  transitiveUpstreamProvider,
  globalProvider,
];
