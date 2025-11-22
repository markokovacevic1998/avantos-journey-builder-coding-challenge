export type AvantosFieldType =
  | "button"
  | "checkbox-group"
  | "object-enum"
  | "short-text"
  | "multi-select"
  | "multi-line-text";

export interface FieldDefinition {
  avantos_type: AvantosFieldType;
  title?: string;
  type: "object" | "array" | "string";
  format?: "email";
  items?: { enum: string[]; type: "string" };
  enum?: null | Array<{ title: string }> | string[];
  uniqueItems?: boolean;
}

export interface FieldSchema {
  type: "object";
  properties: Record<string, FieldDefinition>;
  required: string[];
}

export interface UiControlElement {
  type: "Control";
  scope: string;
  label?: string;
  options?: Record<string, unknown>;
}

export interface UiButtonElement {
  type: "Button";
  scope: string;
  label?: string;
}

export interface UiSchema {
  type: "VerticalLayout";
  elements: Array<UiControlElement | UiButtonElement>;
}

export interface DynamicFieldConfigEntry {
  selector_field: string;
  payload_fields: Record<string, { type: "form_field"; value: string }>;
  endpoint_id: string;
}

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchema;
  ui_schema: UiSchema;
  dynamic_field_config: Record<string, DynamicFieldConfigEntry>;
}

export interface GraphNodeData {
  id: string;
  component_key: string;
  component_type: "form";
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: Record<string, unknown>;
  sla_duration: {
    number: number;
    unit: "minutes" | "hours" | "days" | "weeks";
  };
  approval_required: boolean;
  approval_roles: string[];
}

export interface GraphNode {
  id: string;
  type: "form";
  position: { x: number; y: number };
  data: GraphNodeData;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface ActionBlueprintGraphDescription {
  $schema?: string;
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
  branches: unknown[];
  triggers: unknown[];
}

export type FormId = string;

export type FieldId = string;

export interface Field {
  id: FieldId;
  label: string;
  type: string;
}

export interface FormNode {
  id: FormId;
  name: string;
  fields: Field[];
  upstreamIds: FormId[];
  downstreamIds: FormId[];
  formDefinitionId: string;
}

export interface ActionGraph {
  formsById: Record<FormId, FormNode>;
}
