import React from 'react';

import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { noop } from '@/utils/functional';

export type CommentModeContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;
};

const defaultCommentContext = {
  isOpen: false,
  close: noop,
  open: noop,
  toggle: noop,
};
export const CommentModeContext = React.createContext<CommentModeContext>(defaultCommentContext);
export const { Consumer: CommentModeConsumer } = CommentModeContext;

type CommentProviderProps = {
  isPrototyping: boolean;
  goToDesign: () => void;
};

const Provider: React.FC<CommentProviderProps> = ({ children, isPrototyping, goToDesign }) => {
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const eventualEngine = React.useContext(EventualEngineContext)!;

  const open = () => {
    if (isPrototyping) {
      goToDesign();
    }
    openTool();
    eventualEngine.get()?.comment?.enable();
  };

  const close = () => {
    closeTool();
    eventualEngine.get()?.comment?.disable();
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  return (
    <CommentModeContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
      }}
    >
      {children}
    </CommentModeContext.Provider>
  );
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
};

export const CommentModeProvider: any = connect(null, mapDispatchToProps)(Provider);
