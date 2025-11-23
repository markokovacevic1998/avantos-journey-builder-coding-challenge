"use client";

export function PrefillSelector({
  field,
  onSelect,
  onClose,
}: {
  field: string;
  onSelect: (item: any) => void; // kasnije tipiziramo
  onClose: () => void;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-xl w-[420px]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Select Prefill Source
        </h2>
      </div>

      <p className="text-sm text-slate-600 mb-6">
        Choose where the value for <strong>{field}</strong> should come from.
      </p>

      {/* ----------------------------------------------------
       * SECTIONS (prazno UI, spremno da se doda logika kasnije)
       * -------------------------------------------------- */}

      <div className="space-y-6">
        {/* DIRECT UPSTREAM SECTION */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Direct Upstream Forms
          </h3>

          <div className="border rounded-lg divide-y">
            {/* Placeholder items */}
            <button
              className="w-full text-left px-4 py-2 hover:bg-slate-50 transition"
              onClick={() => onSelect({ placeholder: true })}
            >
              Upstream Option #1
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-slate-50 transition"
              onClick={() => onSelect({ placeholder: true })}
            >
              Upstream Option #2
            </button>
          </div>
        </div>

        {/* TRANSITIVE UPSTREAM SECTION */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Transitive Upstream Forms
          </h3>

          <div className="border rounded-lg divide-y">
            <button
              className="w-full text-left px-4 py-2 hover:bg-slate-50 transition"
              onClick={() => onSelect({ placeholder: true })}
            >
              Transitive Option #1
            </button>
          </div>
        </div>

        {/* GLOBAL SOURCES SECTION */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Global Sources
          </h3>

          <div className="border rounded-lg divide-y">
            <button
              className="w-full text-left px-4 py-2 hover:bg-slate-50 transition"
              onClick={() => onSelect({ placeholder: true })}
            >
              Global Value #1
            </button>

            <button
              className="w-full text-left px-4 py-2 hover:bg-slate-50 transition"
              onClick={() => onSelect({ placeholder: true })}
            >
              Global Value #2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
