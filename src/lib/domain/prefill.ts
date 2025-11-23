export type PrefillSource =
  | "FORM_FIELD"
  | "GLOBAL"
  | "DIRECT_UPSTREAM"
  | "TRANSITIVE_UPSTREAM";

export interface FormFieldPrefillSource {
  source: "FORM_FIELD";
  fromFormId: string;
  fromFieldId: string;
  label: string;
}

export interface GlobalPrefillSource {
  source: "GLOBAL";
  globalId: string;
  label: string;
}

export interface FieldPrefillConfig {
  fieldId: string;
  config: FormFieldPrefillSource | GlobalPrefillSource;
}

export type PrefillConfigByFormId = {
  [formId: string]: {
    [fieldId: string]: FieldPrefillConfig;
  };
};
