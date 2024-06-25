import type { Nullable } from '@voiceflow/common';
import { Portal, useContextApi } from '@voiceflow/ui';
import React from 'react';

import type { PreviewOptions } from './DragLayer';
import DragLayer from './DragLayer';

export interface DragContextPreviewProps {
  getStyle: () => { width?: number; height?: number };
}

export type DragContextType = null | {
  isRegistered: (type: string) => boolean;
  renderPreview: <T>(type: string, props: T & DragContextPreviewProps) => React.ReactNode;
  registerPreview: <T>(
    type: string,
    component: Nullable<React.FC<T & DragContextPreviewProps>>,
    options?: Partial<PreviewOptions>
  ) => void;
};

export const DragContext = React.createContext<DragContextType>(null);
export const { Consumer: DragConsumer } = DragContext;

export const DragProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const previewComponents = React.useRef<Record<string, [React.FC<any>, Partial<PreviewOptions>] | null>>({});

  const registerPreview = <T,>(
    type: string,
    component: Nullable<React.FC<T & DragContextPreviewProps>>,
    options: Partial<PreviewOptions> = {}
  ) => {
    previewComponents.current[type] = component ? [component, options] : null;
  };

  const renderPreview = <T,>(type: string, props: T & DragContextPreviewProps) => {
    const preview = type && previewComponents.current[type];

    if (!preview) {
      return null;
    }

    const [Component] = preview;

    return <Component {...props} />;
  };
  const isRegistered = (type: string) => !!previewComponents.current[type];

  const getOptions = (type: string) => previewComponents.current[type]?.[1];

  const api = useContextApi({
    getOptions,
    isRegistered,
    renderPreview,
    registerPreview,
  });

  return (
    <DragContext.Provider value={api}>
      {children}
      <Portal portalNode={document.body}>
        <DragLayer {...api} />
      </Portal>
    </DragContext.Provider>
  );
};
