import { LayoutNode } from "@/src/lib/domain/types";

interface NodesCanvasProps {
  nodes: LayoutNode[];
  offsetX: number;
  offsetY: number;
  onNodeClick: (node: LayoutNode) => void;
}

// TODO put this in constants.js
const NODE_W = 180;
const NODE_H = 80;
const PORT_SIZE = 12;

export function NodesCanvas({
  nodes,
  offsetX,
  offsetY,
  onNodeClick,
}: NodesCanvasProps) {
  if (!nodes.length) return null;

  return (
    <>
      {nodes.map((node) => {
        const x = node.left + offsetX;
        const y = node.top + offsetY;

        return (
          <div
            key={node.id}
            className="
              absolute 
              bg-white 
              rounded-xl 
              shadow-md 
              border 
              hover:border-blue-500 
              hover:shadow-lg 
              cursor-pointer 
              z-10 
              transition 
              flex 
              flex-col 
              justify-center 
              items-center
              text-center
              select-none
            "
            style={{
              width: NODE_W,
              height: NODE_H,
              left: x,
              top: y,
            }}
            onClick={() => onNodeClick(node)}
          >
            <h2 className="text-sm text-slate-800 font-semibold">
              {node.name}
            </h2>
            <p className="text-xs text-gray-500">{node.fields.length} fields</p>

            <div
              className="absolute bg-blue-600 rounded-full z-20"
              style={{
                width: PORT_SIZE,
                height: PORT_SIZE,
                left: -PORT_SIZE / 2,
                top: `calc(50% - ${PORT_SIZE / 2}px)`,
              }}
            />

            <div
              className="absolute bg-blue-600 rounded-full z-20"
              style={{
                width: PORT_SIZE,
                height: PORT_SIZE,
                right: -PORT_SIZE / 2,
                top: `calc(50% - ${PORT_SIZE / 2}px)`,
              }}
            />
          </div>
        );
      })}
    </>
  );
}
