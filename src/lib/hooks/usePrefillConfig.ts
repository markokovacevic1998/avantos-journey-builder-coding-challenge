import { useGraphContext } from "@/src/context/GraphContext";
import { useCallback, useEffect, useState } from "react";
import { FieldId, FormId } from "../domain/types";

export function usePrefillConfig() {
  const { graph, loading, error } = useGraphContext();
  const [prefillConfig, setPrefillConfig] = useState([]);

  // setFieldSource

  // clearFieldSource

  function initialPrefillUpdate(formId: FormId, fields: { id: FieldId }[]) {
    setPrefillConfig((prev) => {
      if (prev[formId]) return prev;

      const fieldMap = Object.fromEntries(
        fields.map((field) => [field.id, null])
      );

      return {
        ...prev,
        [formId]: fieldMap,
      };
    });
  }
  return {
    prefillConfig,
    initialPrefillUpdate,
  };
}
