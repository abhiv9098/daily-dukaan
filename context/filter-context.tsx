"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  TransactionFilters,
  defaultFilters,
  getDefaultFilters,
} from "@/hooks/use-filtered-transactions";

interface FilterContextValue {
  filters: TransactionFilters;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("dukaan_filters");
    if (saved) {
      try {
        setFilters(JSON.parse(saved));
      } catch (e) {
        setFilters(getDefaultFilters());
      }
    } else {
      setFilters(getDefaultFilters());
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("dukaan_filters", JSON.stringify(filters));
    }
  }, [filters, isInitialized]);

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const resetFilters = () => setFilters(getDefaultFilters());

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, setSearch, resetFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
}
