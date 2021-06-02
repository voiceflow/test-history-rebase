import React from 'react';

export type HoverValue = {
  isHovered: boolean;
  setOverride: () => void;
  clearOverride: () => void;
};

export const HoverContext = React.createContext<HoverValue | null>(null);
export const { Consumer: HoverConsumer, Provider: HoverProvider } = HoverContext;
