import React from 'react';

import { MousePositionContext } from '@/contexts';
import { withContext } from '@/hocs';

import { EngineContext } from './EngineContext';

export const BufferType = {
  BLOCK: 'block',
};

export const ClipboardContext = React.createContext(null);
export const { Consumer: ClipboardConsumer } = ClipboardContext;

const IGNORED_TAGS = ['TEXTAREA', 'INPUT'];

export const ClipboardProvider = ({ children }) => {
  const engine = React.useContext(EngineContext);
  const mousePosition = React.useContext(MousePositionContext);

  const copy = React.useCallback((nodeID) => engine.copyActive(nodeID), [engine]);

  React.useEffect(() => {
    const handlePaste = (event) => {
      if (IGNORED_TAGS.includes(event.target.nodeName)) {
        return;
      }

      event.preventDefault();

      const position = engine.canvas.transformPoint(mousePosition.current);

      engine.paste(event.clipboardData.getData('text'), position);
    };

    document.addEventListener('paste', handlePaste);

    return () => document.removeEventListener('paste', handlePaste);
  }, [engine, mousePosition]);

  return <ClipboardContext.Provider value={{ copy }}>{children}</ClipboardContext.Provider>;
};

export const withClipboard = withContext(ClipboardContext, 'clipboard');
