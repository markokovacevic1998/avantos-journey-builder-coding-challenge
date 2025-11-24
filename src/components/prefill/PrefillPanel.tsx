import { FieldPrefillConfig } from "@/src/lib/domain/prefill";
import { Field, FieldId, FormNode } from "@/src/lib/domain/types";

interface PrefillPanelProps {
  node: FormNode;
  prefill: Record<FieldId, FieldPrefillConfig | null>;
  onFormFieldClick: (fieldId: string) => void;
  onClear: (fieldId: string) => void;
}

export function PrefillPanel({
  node,
  prefill,
  onFormFieldClick,
  onClear,
}: PrefillPanelProps) {
  if (!node) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border w-[360px]">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        Prefill for {node.name}
      </h2>

      <div className="space-y-1">
        {node.fields.map((field: Field) => {
          const config = prefill[field.id];

          return (
            <div
              key={field.id}
              className={`
                flex justify-between items-center px-2 py-3 border-b 
                transition 
                ${
                  config
                    ? "cursor-default"
                    : "cursor-pointer hover:bg-slate-200 hover:border-slate-300"
                }
              `}
              onClick={() => {
                if (!config) onFormFieldClick(field.id);
              }}
            >
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  {field.label || field.id}
                </p>

                {config ? (
                  <p className="text-xs text-blue-600 mt-1">{config.label}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">No prefill set</p>
                )}
              </div>

              {config && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-sm transition"
                  onClick={(e) => {
                    e.stopPropagation(); // sprečava otvaranje modal-a
                    onClear(field.id);
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
