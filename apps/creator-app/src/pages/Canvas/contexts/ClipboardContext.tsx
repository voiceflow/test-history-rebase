import { useContextApi, withContext } from '@voiceflow/ui';
import React from 'react';

import { SLATE_EDITOR_CLASS_NAME } from '@/pages/Canvas/managers/MarkupText/constants';
import { useEditingMode } from '@/pages/Project/hooks/modes';

import { EngineContext } from './EngineContext';

interface CopyOptions {
  disableSuccessToast?: boolean;
}

export interface ClipboardContextValue {
  copy: (nodeID?: string | null, options?: CopyOptions) => void;
}

const IGNORED_TAGS = new Set(['TEXTAREA', 'INPUT']);

export const ClipboardContext = React.createContext<ClipboardContextValue | null>(null);
export const { Consumer: ClipboardConsumer } = ClipboardContext;

export const ClipboardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const engine = React.useContext(EngineContext)!;

  const copy = React.useCallback((nodeID?: string | null, options?: CopyOptions) => engine.copyActive(nodeID, options), []);
  const isEditingMode = useEditingMode();

  React.useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!isEditingMode) return;
      const target = event.target as Element;

      if (
        IGNORED_TAGS.has(target.nodeName) ||
        // can't use .closest here since target node can be removed from the DOM in the slate past handler
        event.composedPath().some((node) => 'classList' in node && (node as HTMLElement).classList.contains(SLATE_EDITOR_CLASS_NAME))
      ) {
        return;
      }

      event.preventDefault();

      engine.paste(event.clipboardData!.getData('text'), engine.getMouseCoords());
    };

    document.addEventListener('paste', handlePaste);

    return () => document.removeEventListener('paste', handlePaste);
  }, [isEditingMode]);

  const api = useContextApi({ copy });

  return <ClipboardContext.Provider value={api}>{children}</ClipboardContext.Provider>;
};

export const withClipboard = withContext(ClipboardContext, 'clipboard');
