import React from 'react';

export interface HoverValue {
  isHovered: boolean;
  setOverride: (event?: React.MouseEvent<HTMLElement>) => void;
  clearOverride: (event?: React.MouseEvent<HTMLElement>) => void;
}

export const HoverContext = React.createContext<HoverValue | null>(null);
export const { Consumer: HoverConsumer, Provider: HoverProvider } = HoverContext;
