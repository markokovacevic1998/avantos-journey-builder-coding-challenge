"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalContextValue = {
  openModal: (name: string) => void;
  closeModal: () => void;
  registerModal: (name: string, content: ReactNode) => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be inside ModalProvider");
  return context;
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<{ [key: string]: ReactNode }>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const registerModal = (name: string, content: ReactNode) => {
    setModals((prev) => ({
      ...prev,
      [name]: content,
    }));
  };

  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, registerModal }}>
      {children}

      {typeof window !== "undefined" &&
        createPortal(
          activeModal ? (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
              <div className="relative bg-white !bg-white text-black rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] min-w-[380px] max-w-[600px] p-8 animate-fadeScale">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  ✕
                </button>

                {modals[activeModal]}
              </div>
            </div>
          ) : null,
          document.body
        )}
    </ModalContext.Provider>
  );
}
