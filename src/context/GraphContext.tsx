"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getRawGraphData } from "../lib/api/getRawGraphData";
import { cleanGraphData } from "../lib/domain/cleanGraphData";
import { ActionGraph } from "../lib/domain/types";

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

  const loadGraph = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const raw = await getRawGraphData();
      const processed = cleanGraphData(raw);

      setGraph(processed);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to load graph");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const value = useMemo(
    () => ({ graph, setGraph, loading, error }),
    [graph, loading, error]
  );

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}

export const useGraphContext = () => {
  const context = useContext(GraphContext);

  if (!context) {
    throw new Error("useGraphContext must be used inside GraphContextProvider");
  }

  return context;
};
