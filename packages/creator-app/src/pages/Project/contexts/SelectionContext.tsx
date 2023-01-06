import React from 'react';

export type SelectionTargetsContextValue = string[];
export type SelectionSetTargetsContextValue = (targets: string[]) => void;

export const SelectionTargetsContext = React.createContext<SelectionTargetsContextValue>([]);
export const SelectionSetTargetsContext = React.createContext<SelectionSetTargetsContextValue>(() => {});

export const SelectionProvider: React.OldFC = ({ children }) => {
  const [targets, setTargets] = React.useState<string[]>([]);

  return (
    <SelectionTargetsContext.Provider value={targets}>
      <SelectionSetTargetsContext.Provider value={setTargets}>{children}</SelectionSetTargetsContext.Provider>
    </SelectionTargetsContext.Provider>
  );
};
