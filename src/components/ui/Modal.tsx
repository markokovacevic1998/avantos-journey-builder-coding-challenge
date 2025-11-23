"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // TODO implement outside click closing
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg relative min-w-[400px]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-600 hover:text-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
