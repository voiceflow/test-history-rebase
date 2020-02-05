import React from 'react';

import ModalRoot from '@/componentsV2/Modal/components/ModalRoot';

export const ModalLayerContext = React.createContext(null);
export const { Consumer: ModalLayerConsumer } = ModalLayerContext;

export const ModalLayerProvider = ({ children }) => {
  const rootRef = React.useRef();
  const modalToggles = React.useRef({});

  const register = React.useCallback((key, toggle) => {
    modalToggles.current[key] = toggle;
  }, []);

  const toggle = React.useCallback((key) => {
    modalToggles.current[key]?.();
  }, []);

  return (
    <ModalLayerContext.Provider value={{ rootRef, register, toggle }}>
      {children}
      <ModalRoot ref={rootRef} />
    </ModalLayerContext.Provider>
  );
};
