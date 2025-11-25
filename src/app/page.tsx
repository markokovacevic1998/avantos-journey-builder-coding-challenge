"use client";

import { useGraphContext } from "../context/GraphContext";
import { NodesCanvas } from "../components/graph/NodesCanvas";
import { EdgesCanvas } from "../components/graph/EdgesCanvas";

import { useGraphLayout } from "../lib/hooks/useGraphLayout";
import { useGraphBounds } from "../lib/hooks/useGraphBounds";
import { FieldId, FormNode, LayoutNode } from "../lib/domain/types";
import Modal from "../components/ui/Modal";
import { useState } from "react";
import { PrefillPanel } from "../components/prefill/PrefillPanel";
import { usePrefillConfig } from "../lib/hooks/usePrefillConfig";
import { PrefillSelector } from "../components/prefill/PrefillSelector";
import {
  FieldPrefillConfig,
  FormFieldPrefillSource,
  GlobalPrefillSource,
} from "../lib/domain/prefill";

export default function GraphPage() {
  const { graph, loading, error } = useGraphContext();
  const [selectedNode, setSelectedNode] = useState<FormNode | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<FieldId | null>(null);
  const {
    prefillConfig,
    initialPrefillUpdate,
    setFieldSource,
    clearFieldSource,
  } = usePrefillConfig();

  const forms = Object.values(graph.formsById);

  const { layoutNodes } = useGraphLayout({
    forms,
    graph,
  });

  const { bounds, graphWidth, graphHeight } = useGraphBounds(layoutNodes);

  const offsetX =
    graphWidth / 2 - (bounds.maxX - bounds.minX) / 2 - bounds.minX;

  const offsetY =
    graphHeight / 2 - (bounds.maxY - bounds.minY) / 2 - bounds.minY;

  const onNodeClick = (node: LayoutNode) => {
    setSelectedNode(node);
    initialPrefillUpdate(node.id, node.fields);
    setActiveModal("prefill");
  };

  const onFormFieldClick = (fieldId: string) => {
    setSelectedField(fieldId);
    setActiveModal("sourceSelector");
  };

  const onFormFieldClear = (fieldId: string) => {
    if (!selectedNode) return;
    clearFieldSource(selectedNode.id, fieldId);
  };

  const onFieldSourceReplacement = (
    source: FormFieldPrefillSource | GlobalPrefillSource
  ) => {
    if (!selectedField || !selectedNode) return;

    const fieldPrefillConfig: FieldPrefillConfig = {
      fieldId: selectedField,
      config: source,
    };

    setFieldSource(selectedNode.id, selectedField, fieldPrefillConfig);
    setActiveModal("prefill");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedNode(null);
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-100 p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-10">
        Form Dependency Graph - Avantos.ai
      </h1>

      <div className="relative w-full flex-1 overflow-auto">
        <div
          className="absolute"
          style={{
            width: graphWidth,
            height: graphHeight,
            left: "50%",
            top: "50%",
            transform: "translate(-58%, -63%)",
          }}
        >
          <EdgesCanvas
            nodes={layoutNodes}
            offsetX={offsetX}
            offsetY={offsetY}
          />
          <NodesCanvas
            nodes={layoutNodes}
            offsetX={offsetX}
            offsetY={offsetY}
            onNodeClick={onNodeClick}
          />
        </div>
      </div>
      {activeModal === "prefill" && selectedNode && (
        <Modal onClose={closeModal}>
          <PrefillPanel
            node={selectedNode}
            onFormFieldClick={onFormFieldClick}
            prefill={prefillConfig[selectedNode.id] || {}}
            onClear={onFormFieldClear}
          />
        </Modal>
      )}
      {activeModal === "sourceSelector" && selectedField && selectedNode && (
        <Modal onClose={() => setActiveModal("prefill")}>
          <PrefillSelector
            fieldId={selectedField}
            formId={selectedNode.id}
            onSelect={onFieldSourceReplacement}
          />
        </Modal>
      )}
    </div>
  );
}
