import React from 'react';

import { withContext } from '@/hocs';

import { EngineContext } from './EngineContext';

export const BufferType = {
  BLOCK: 'block',
};

export type ClipboardContextValue = {
  copy: (nodeID?: string) => void;
};

const IGNORED_TAGS = ['TEXTAREA', 'INPUT'];

export const ClipboardContext = React.createContext<ClipboardContextValue | null>(null);
export const { Consumer: ClipboardConsumer } = ClipboardContext;

export const ClipboardProvider: React.FC = ({ children }) => {
  const engine = React.useContext(EngineContext)!;

  const copy = React.useCallback((nodeID?: string) => engine.copyActive(nodeID), []);

  React.useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (IGNORED_TAGS.includes((event.target as Element).nodeName)) {
        return;
      }

      event.preventDefault();

      engine.paste(event.clipboardData!.getData('text'), engine.getMousePoint());
    };

    document.addEventListener('paste', handlePaste);

    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return <ClipboardContext.Provider value={{ copy }}>{children}</ClipboardContext.Provider>;
};

export const withClipboard = withContext(ClipboardContext, 'clipboard');
