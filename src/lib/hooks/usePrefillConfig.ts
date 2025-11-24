import { useState } from "react";
import { FieldId, FormId } from "../domain/types";
import {
  FieldPrefillConfig,
  PrefillConfigByFormId,
} from "../domain/prefill";

export function usePrefillConfig() {
  const [prefillConfig, setPrefillConfig] = useState<PrefillConfigByFormId>(
    {}
  );

  function initialPrefillUpdate(formId: FormId, fields: { id: FieldId }[]) {
    setPrefillConfig((prev) => {
      if (prev[formId]) return prev;

      const fieldMap: Record<FieldId, FieldPrefillConfig | null> =
        Object.fromEntries(fields.map((field) => [field.id, null]));

      return {
        ...prev,
        [formId]: fieldMap,
      };
    });
  }

  function setFieldSource(
    formId: FormId,
    fieldId: FieldId,
    config: FieldPrefillConfig | null
  ) {
    setPrefillConfig((prev) => {
      const formCfg: Record<FieldId, FieldPrefillConfig | null> =
        prev[formId] ?? {};

      return {
        ...prev,
        [formId]: {
          ...formCfg,
          [fieldId]: config,
        },
      };
    });
  }

  function clearFieldSource(formId: FormId, fieldId: FieldId) {
    setFieldSource(formId, fieldId, null);
  }

  return {
    prefillConfig,
    initialPrefillUpdate,
    setFieldSource,
    clearFieldSource,
  };
}
