"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getRawGraphData } from "../lib/api/getRawGraphData";
import { cleanGraphData } from "../lib/domain/cleanGraphData";
import { ActionGraph, FormId, FormNode } from "../lib/domain/types";

interface GraphContextValue {
  graph: ActionGraph;
  setGraph: (g: ActionGraph) => void;
  loading: boolean;
  error: string | null;
}

const defaultGraphContext: GraphContextValue = {
  graph: { formsById: {} },
  setGraph: () => {},
  loading: true,
  error: null,
};

export const GraphContext =
  createContext<GraphContextValue>(defaultGraphContext);

export function GraphContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [graph, setGraph] = useState<ActionGraph>({
    formsById: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const rawData = await getRawGraphData().catch((err) => setError(err));
      setLoading(false);

      const cleanData = cleanGraphData(rawData);

      setGraph(cleanData);
    }

    init();
  }, []);

  const value = useMemo(
    () => ({ graph, setGraph, loading, error }),
    [graph, setGraph, loading, error]
  );

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}

export const useGraphContext = () => {
  return useContext(GraphContext);
};
