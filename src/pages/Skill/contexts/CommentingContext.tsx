import React from 'react';

import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import * as Router from '@/ducks/router';
import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

export type CommentModeContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;
  setValues: (value: string, mentionedUsers: number[]) => void;
  text: string;
  mentions: number[];
  threadID: string | null;
  setThreadID: (id: string | null) => void;
  commentID: string | null;
  setCommentID: (id: string | null) => void;
  postThread: () => void;
  updateComment: () => void;
  postComment: () => void;
  deleteComment: (thread: string, comment: string) => void;
  resolveThread: (id: string) => void;
  resetValues: () => void;
};

const defaultCommentContext = {
  isOpen: false,
  close: noop,
  open: noop,
  toggle: noop,
  setValues: noop,
  text: '',
  mentions: [],
  threadID: null,
  setThreadID: noop,
  commentID: null,
  setCommentID: noop,
  postThread: noop,
  updateComment: noop,
  postComment: noop,
  deleteComment: noop,
  resolveThread: noop,
  resetValues: noop,
};

export const CommentModeContext = React.createContext<CommentModeContext>(defaultCommentContext);

export const { Consumer: CommentModeConsumer } = CommentModeContext;

const Provider: React.FC<CommentProviderProps> = ({
  children,
  goToCommenting,
  createThread,
  createComment,
  updateComment,
  removeComment,
  updateThread,
}) => {
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const [text, setTextValue] = React.useState('');
  const [mentions, updateMentions] = React.useState<number[]>([]);
  const [threadID, setThreadID] = React.useState<null | string>(null);
  const [commentID, setCommentID] = React.useState<null | string>(null);

  const open = () => {
    goToCommenting();
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

  const setValues = React.useCallback(
    (value: string, mentionedUsers: number[]) => {
      setTextValue(value);
      updateMentions(mentionedUsers);
    },
    [setTextValue, updateMentions]
  );

  const resetValues = React.useCallback(() => {
    setTextValue('');
    updateMentions([]);
  }, [text, mentions]);

  const postThread = () => {
    // TODO: gather nodeID and position when node is added at anchor drop
    createThread({ nodeID: 'nodeID', position: [200, 200], data: { text, mentions } });
    resetValues();
  };

  const updateCommentData = () => {
    updateComment(threadID!, commentID!, { text, mentions });
    resetValues();
  };

  const postComment = () => {
    createComment(threadID!, { text, mentions });
    resetValues();
  };

  const deleteComment = (thread: string, comment: string) => removeComment(thread, comment);

  const resolveThread = (id: string) => updateThread(id, { resolved: true });

  return (
    <CommentModeContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
        text,
        mentions,
        setValues,
        threadID,
        setThreadID,
        commentID,
        setCommentID,
        postThread,
        updateComment: updateCommentData,
        postComment,
        deleteComment,
        resolveThread,
        resetValues,
      }}
    >
      {children}
    </CommentModeContext.Provider>
  );
};

const mapDispatchToProps = {
  goToCommenting: Router.goToCurrentCanvasCommenting,
  createComment: Thread.createComment,
  createThread: Thread.createThread,
  updateComment: Thread.updateComment,
  removeComment: Thread.deleteComment,
  updateThread: Thread.updateThreadData,
};

export type CommentProviderProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export const CommentModeProvider: any = connect(null, mapDispatchToProps)(Provider);
