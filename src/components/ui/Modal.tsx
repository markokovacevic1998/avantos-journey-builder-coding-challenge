"use client";

import { useEffect } from "react";
import { useModal } from "@/src/context/ModalContext";

export default function Modal({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const { registerModal } = useModal();

  useEffect(() => {
    registerModal(name, children);
  }, [name, children, registerModal]);

  return null;
}
