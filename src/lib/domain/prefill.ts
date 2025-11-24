import { FieldId, FormId } from "./types";

export type PrefillSource =
  | "FORM_FIELD"
  | "GLOBAL"
  | "DIRECT_UPSTREAM"
  | "TRANSITIVE_UPSTREAM";

export interface FormFieldPrefillSource {
  source: Exclude<PrefillSource, "GLOBAL">;
  fromFormId: FormId;
  fromFieldId: FieldId;
  label: string;
}

export interface GlobalPrefillSource {
  source: Extract<PrefillSource, "GLOBAL">;
  globalId: string;
  label: string;
}

export type FieldPrefillConfig =
  | FormFieldPrefillSource
  | GlobalPrefillSource;

export type PrefillConfigByFormId = Record<
  FormId,
  Record<FieldId, FieldPrefillConfig | null>
>;
