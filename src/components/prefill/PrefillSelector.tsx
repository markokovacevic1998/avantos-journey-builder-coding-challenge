"use client";

import { useGraphContext } from "@/src/context/GraphContext";
import { prefillProviders } from "@/src/lib/domain/prefillProviders";
import { FieldPrefillConfig } from "@/src/lib/domain/prefill";
import { FieldId, FormId } from "@/src/lib/domain/types";
import { useState } from "react";

export function PrefillSelector({
  fieldId,
  formId,
  onSelect,
}: {
  fieldId: FieldId;
  formId: FormId;
  onSelect: (item: FieldPrefillConfig) => void;
}) {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const { graph } = useGraphContext();

  if (!fieldId || !formId)
    return <div className="text-slate-800">Missing field/form ID</div>;

  function toggleDropdown(sourceId: string) {
    setExpandedSource((prev) => (prev === sourceId ? null : sourceId));
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl w-[420px] text-slate-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Select Prefill Source</h2>
      </div>

      <p className="text-sm text-slate-700 mb-6">
        Choose where the value for{" "}
        <strong className="text-slate-900">{fieldId}</strong> should come from.
      </p>

      {prefillProviders.map((provider) => {
        const forms = provider.getForms(graph, formId) ?? [];

        return (
          <div key={provider.id} className="space-y-4 mt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              {provider.label}
            </h3>

            {forms.length === 0 && (
              <p className="text-xs text-slate-500 pl-1">
                No sources available
              </p>
            )}

            {forms.map((form) => {
              const expanded = expandedSource === form.id;
              const fields =
                provider.getFields?.(form) ??
                form.fields ??
                [];

              return (
                <div
                  key={form.id}
                  className="border border-slate-300 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-100 transition text-slate-900"
                    onClick={() => toggleDropdown(form.id)}
                  >
                    <span>{form.name}</span>

                    <span
                      className={`transition-transform ${
                        expanded ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </button>

                  {expanded && fields.length > 0 && (
                    <div className="border-t border-slate-200">
                      {fields.map((f) => (
                        <button
                          key={f.id}
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800 text-sm"
                          onClick={() => {
                            const providerSourceMap: Record<
                              string,
                              FieldPrefillConfig["source"]
                            > = {
                              direct: "DIRECT_UPSTREAM",
                              transitive: "TRANSITIVE_UPSTREAM",
                              global: "GLOBAL",
                            };

                            const sourceType =
                              providerSourceMap[provider.id] ?? "FORM_FIELD";

                            const config: FieldPrefillConfig =
                              sourceType === "GLOBAL"
                                ? {
                                    source: "GLOBAL",
                                    globalId: `${form.id}:${f.id}`,
                                    label: `${f.label} from ${form.name}`,
                                  }
                                : {
                                    source: sourceType,
                                    fromFormId: form.id,
                                    fromFieldId: f.id,
                                    label: `${f.label} from ${form.name}`,
                                  };

                            onSelect(config);
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
