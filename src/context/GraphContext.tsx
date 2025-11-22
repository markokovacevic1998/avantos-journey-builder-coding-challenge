import { createContext, useContext, useMemo, useState } from "react";

export const GraphContext = createContext(null);

export function GraphContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [graph, setGraph] = useState({});

  const value = useMemo(() => ({ graph }), [graph]);

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}

export const useGraphContext = () => {
  return useContext(GraphContext);
};
