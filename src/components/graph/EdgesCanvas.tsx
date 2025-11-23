import { LayoutNode } from "@/src/lib/domain/types";

interface EdgesCanvasProps {
  nodes: LayoutNode[];
  offsetX: number;
  offsetY: number;
}

// TODO put this in constants.js
const EDGE_COLOR = "rgba(59, 130, 246, 0.6)";
const EDGE_THICKNESS = 3;

export function EdgesCanvas({ nodes, offsetX, offsetY }: EdgesCanvasProps) {
  if (!nodes.length) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {nodes.flatMap((source) =>
        source.downstreamIds.map((targetId) => {
          const target = nodes.find((n) => n.id === targetId);
          if (!target) return [];

          const x1 = source.rightPortX + offsetX;
          const y1 = source.rightPortY + offsetY;

          const x2 = target.leftPortX + offsetX;
          const y2 = target.leftPortY + offsetY;

          const dx = x2 - x1;
          const dy = y2 - y1;

          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          return (
            <div
              key={`${source.id}-${target.id}`}
              className="absolute rounded-full"
              style={{
                width: `${length}px`,
                height: `${EDGE_THICKNESS}px`,
                backgroundColor: EDGE_COLOR,
                top: `${y1}px`,
                left: `${x1}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: "0 0",
              }}
            />
          );
        })
      )}
    </div>
  );
}
