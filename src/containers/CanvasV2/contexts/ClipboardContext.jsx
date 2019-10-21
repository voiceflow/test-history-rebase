import React from 'react';

import { MousePositionContext } from '@/contexts';
import { withContext } from '@/hocs';
import { preventDefault } from '@/utils/dom';

import { EngineContext } from './EngineContext';

export const BufferType = {
  BLOCK: 'block',
};

export const ClipboardContext = React.createContext(null);
export const { Consumer: ClipboardConsumer } = ClipboardContext;

export const ClipboardProvider = ({ children }) => {
  const engine = React.useContext(EngineContext);
  const mousePosition = React.useContext(MousePositionContext);

  const copy = React.useCallback((nodeID) => engine.copyActive(nodeID), []);

  React.useEffect(() => {
    const handlePaste = preventDefault((event) => {
      const position = engine.canvas.transformPoint(mousePosition.current);

      engine.paste(event.clipboardData.getData('text'), position);
    });

    document.addEventListener('paste', handlePaste);

    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return <ClipboardContext.Provider value={{ copy }}>{children}</ClipboardContext.Provider>;
};

export const withClipboard = withContext(ClipboardContext, 'clipboard');
