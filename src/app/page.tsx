"use client";

import { useGraphContext } from "../context/GraphContext";
import { NodesCanvas } from "../components/graph/NodesCanvas";
import { EdgesCanvas } from "../components/graph/EdgesCanvas";

import { useGraphLayout } from "../lib/hooks/useGraphLayout";
import { useGraphBounds } from "../lib/hooks/useGraphBounds";
import { LayoutNode } from "../lib/domain/types";

export default function GraphPage() {
  const { graph, loading, error } = useGraphContext();

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

  const handleClick = (node: LayoutNode) => {
    console.log("Clicked:", node);
    // TODO modal open
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-100 p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-10">
        Form Dependency Graph
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
            onNodeClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}
