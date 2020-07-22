import React from 'react';

import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import * as Router from '@/ducks/router';
import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { Comment } from '@/models';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

type NewCommentType = {
  text?: string;
  mentions?: number[];
  threadID?: string;
};

export type CommentModeContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;

  postThread: () => void;
  updateComment: () => void;
  postComment: () => void;
  deleteComment: (thread: string, comment: string) => void;
  resolveThread: (id: string) => void;

  editingComment: Comment | null;
  setEditingValues: (comment: Comment) => void;
  resetEditingValues: () => void;

  newReply: NewCommentType | null;
  newComment: NewCommentType | null;
  setNewValues: (comment: NewCommentType, isReply?: boolean) => void;
  resetNewValues: (isReply?: boolean) => void;
};

const defaultCommentContext = {
  isOpen: false,
  close: noop,
  open: noop,
  toggle: noop,

  postThread: noop,
  updateComment: noop,
  postComment: noop,
  deleteComment: noop,
  resolveThread: noop,

  editingComment: null,
  setEditingValues: noop,
  resetEditingValues: noop,

  newReply: null,
  newComment: null,
  setNewValues: noop,
  resetNewValues: noop,
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

  const [newComment, setNewComment] = React.useState<NewCommentType | null>(null);
  const [newReply, setNewReply] = React.useState<NewCommentType | null>(null);
  const [editingComment, setEditingComment] = React.useState<Comment | null>(null);

  // commenting mode

  const open = () => {
    // this is to enable commenting from a sharable link
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

  // for new comment or reply

  const setNewValues = React.useCallback((comment: NewCommentType, isReply = false) => {
    if (isReply) {
      setNewReply(comment);
    } else {
      setNewComment(comment);
    }
  }, []);

  const resetNewValues = React.useCallback((isReply = false) => {
    isReply ? setNewReply(null) : setNewComment(null);
  }, []);

  // to edit exiting comments

  const setEditingValues = React.useCallback((comment: Comment) => {
    setEditingComment(comment);
  }, []);

  const resetEditingValues = React.useCallback(() => {
    setEditingComment(null);
  }, []);

  // api calls

  const postThread = () => {
    // TODO: gather nodeID and position when node is added at anchor drop
    createThread({ nodeID: 'nodeID', position: [200, 200], data: { text: newComment?.text, mentions: newComment?.mentions } });
    resetNewValues();
  };

  const postComment = () => {
    createComment(newReply!.threadID!, { text: newReply?.text, mentions: newReply?.mentions });
    resetNewValues();
  };

  const updateCommentData = () => {
    updateComment(editingComment!.threadID!, editingComment!.id!, { text: editingComment?.text, mentions: editingComment?.mentions });
    resetEditingValues();
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

        editingComment,
        setEditingValues,
        resetEditingValues,

        newReply,
        newComment,
        setNewValues,
        resetNewValues,

        postThread,
        updateComment: updateCommentData,
        postComment,
        deleteComment,
        resolveThread,
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
