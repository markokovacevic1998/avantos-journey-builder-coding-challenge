"use client";

import { useGraphContext } from "@/src/context/GraphContext";
import { prefillProviders } from "@/src/lib/domain/prefillProviders";
import {
  FormFieldPrefillSource,
  GlobalPrefillSource,
} from "@/src/lib/domain/prefill";
import { useState } from "react";

export function PrefillSelector({
  fieldId,
  formId,
  onSelect,
}: {
  fieldId: string;
  formId: string;
  onSelect: (item: FormFieldPrefillSource | GlobalPrefillSource) => void;
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
        const forms = provider.getForms(graph, formId);

        return (
          <div key={provider.id} className="space-y-4 mt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              {provider.label}
            </h3>

            {(!forms || !forms.length) && (
              <p className="text-xs text-slate-500 pl-1">
                No sources available
              </p>
            )}

            {forms &&
              forms.map((form) => {
                const expanded = expandedSource === form.id;
                const fields = provider.getFields?.(form) || [];

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
                              if (provider.id === "global") {
                                onSelect({
                                  source: "GLOBAL",
                                  globalId: form.id,
                                  label: `${f.label} from ${form.name}`,
                                });
                              } else {
                                onSelect({
                                  source: "FORM_FIELD",
                                  fromFormId: form.id,
                                  fromFieldId: f.id,
                                  label: `${f.label} from ${form.name}`,
                                });
                              }
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
