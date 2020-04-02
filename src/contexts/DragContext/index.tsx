import React from 'react';

import Portal from '@/components/Portal';

import DragLayer from './DragLayer';

export type DragContextPreviewProps = {
  getStyle: () => { width?: number; height?: number };
  [key: string]: any;
};

export type DragContextType = null | {
  getOptions: (type: string) => Record<string, any> | undefined;
  isRegistered: (type: string) => boolean;
  renderPreview: (type: string, props: DragContextPreviewProps) => React.ReactNode;
  registerPreview: (type: string, component: React.FC<DragContextPreviewProps>, options: Record<string, any>) => void;
};

export const DragContext = React.createContext<DragContextType>(null);
export const { Consumer: DragConsumer } = DragContext;

export const DragProvider: React.FC = ({ children }) => {
  const previewComponents = React.useRef<Record<string, [React.FC<DragContextPreviewProps>, Record<string, any>] | null>>({});

  const registerPreview = (type: string, component: React.FC<DragContextPreviewProps>, options: Record<string, any> = {}) => {
    previewComponents.current[type] = component ? [component, options] : null;
  };

  const renderPreview = (type: string, props: DragContextPreviewProps) => {
    const preview = previewComponents.current[type];

    if (!preview) {
      return null;
    }

    const [Component] = preview;

    return <Component {...props} />;
  };
  const isRegistered = (type: string) => !!previewComponents.current[type];

  const getOptions = (type: string) => previewComponents.current[type]?.[1];

  const context = {
    registerPreview,
    renderPreview,
    getOptions,
    isRegistered,
  };

  return (
    <DragContext.Provider value={context}>
      {children}
      <Portal portalNode={document.body}>
        <DragLayer {...context} />
      </Portal>
    </DragContext.Provider>
  );
};
