"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface NamespaceContextType {
  selectedNamespace: string;
  setSelectedNamespace: (ns: string) => void;
}

const NamespaceContext = createContext<NamespaceContextType | undefined>(undefined);

export function NamespaceProvider({ children }: { children: ReactNode }) {
  const [selectedNamespace, setSelectedNamespace] = useState("default");

  return (
    <NamespaceContext.Provider value={{ selectedNamespace, setSelectedNamespace }}>
      {children}
    </NamespaceContext.Provider>
  );
}

export function useNamespace() {
  const context = useContext(NamespaceContext);
  if (context === undefined) {
    throw new Error("useNamespace must be used within a NamespaceProvider");
  }
  return context;
}
