import React, { createContext, useContext, ReactNode } from 'react';
import { usePaletteStore } from '@/hooks/usePaletteStore';

type PaletteContextType = ReturnType<typeof usePaletteStore>;

const PaletteContext = createContext<PaletteContextType | null>(null);

export const PaletteProvider = ({ children }: { children: ReactNode }) => {
  const store = usePaletteStore();
  return <PaletteContext.Provider value={store}>{children}</PaletteContext.Provider>;
};

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
};
