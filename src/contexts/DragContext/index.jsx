import React from 'react';

import DragLayer from './DragLayer';

export const DragContext = React.createContext(null);
export const { Consumer: DragConsumer } = DragContext;

export const DragProvider = ({ children }) => {
  const previewComponents = React.useRef({});

  const registerPreview = (type, component, options = {}) => {
    previewComponents.current[type] = component ? [component, options] : null;
  };
  const renderPreview = (type, props) => {
    if (!previewComponents.current[type]) {
      return null;
    }

    const [Component] = previewComponents.current[type];

    return <Component {...props} />;
  };
  const isRegistered = (type) => previewComponents.current[type];
  const getOptions = (type) => previewComponents.current[type]?.[1];

  const context = {
    registerPreview,
    renderPreview,
    getOptions,
    isRegistered,
  };

  return (
    <DragContext.Provider value={context}>
      {children}
      <DragLayer {...context} />
    </DragContext.Provider>
  );
};
