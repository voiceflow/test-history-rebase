import React from 'react';

import { useEnableDisable, useToggle } from '@/hooks';
import { insert, reorder } from '@/utils/array';

export const StepMenuContext = React.createContext(null);
export const { Consumer: StepMenuConsumer } = StepMenuContext;

export const StepMenuProvider = ({ children }) => {
  const [isEnabled, enable, disable] = useEnableDisable(true);

  return <StepMenuContext.Provider value={{ isEnabled, enable, disable }}>{children}</StepMenuContext.Provider>;
};

export const StepContext = React.createContext(null);
export const { Consumer: StepConsumer, Provider: StepProvider } = StepContext;

export const StepManagerContext = React.createContext(null);
export const { Consumer: StepManagerConsumer } = StepManagerContext;

export const StepManagerProvider = ({ steps, onChange, children }) => {
  const [isDragging, toggleDragging] = useToggle();
  const onAdd = (type) => onChange([...steps, { type }]);

  const onReorder = (sourceIndex, targetIndex) => onChange(reorder(steps, sourceIndex, targetIndex));
  const onInsert = (index, type) => onChange(insert(steps, index, { type }));

  return (
    <StepManagerContext.Provider
      value={{
        reorder: onReorder,
        add: onAdd,
        insert: onInsert,
        isDragging,
        toggleDragging,
      }}
    >
      {children}
    </StepManagerContext.Provider>
  );
};
