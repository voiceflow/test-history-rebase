import { Thread } from '@voiceflow/realtime-sdk';
import { stopPropagation, useOnClickOutside } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';

import { useEnableDisable, useResizeObserver } from '@/hooks';
import { EngineContext, FocusThreadContext } from '@/pages/Canvas/contexts';
import { useCommentingMode } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import { CommentEditor, Container, EditableCommentRef, NewComment, ReplySection, ThreadCommentContainer } from './components';
import { NEW_THREAD_EDITOR } from './constants';

export type { EditableCommentRef } from './components';

export interface ThreadEditorProps {
  thread?: Thread;
  replyRef?: React.RefObject<EditableCommentRef>;
  isFocused: boolean;
  schedulePopperUpdate?: VoidFunction;
}

const ThreadEditor: React.FC<ThreadEditorProps> = ({ thread, replyRef, isFocused, schedulePopperUpdate }) => {
  const engine = React.useContext(EngineContext)!;
  const { dismiss } = React.useContext(DismissableLayerContext);
  const focusThread = React.useContext(FocusThreadContext)!;

  const isCommentingMode = useCommentingMode();

  const ref = React.useRef<HTMLDivElement>(null);
  const [editingCommentID, setEditingCommentID] = React.useState<string | null>(null);
  const [isReplying, enableReplying, disableReplying] = useEnableDisable(false);

  const scrollToBottom = () => {
    if (!isReplying) return;

    schedulePopperUpdate?.();
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  };

  useOnClickOutside(
    ref,
    () => {
      if (!isCommentingMode && isFocused) {
        focusThread.resetFocus();
      }
    },
    [isFocused, isCommentingMode]
  );

  useResizeObserver(ref, scrollToBottom);
  React.useLayoutEffect(scrollToBottom, [isReplying]);

  return (
    <Container
      ref={ref}
      onClick={stopPropagation(dismiss, true)}
      className={cn(ClassName.THREAD_EDITOR, { [NEW_THREAD_EDITOR]: !thread })}
      onDragStart={stopPropagation(null, true)}
      onMouseDown={stopPropagation(null, true)}
      onContextMenu={stopPropagation(null, true)}
    >
      {thread ? (
        <>
          <ThreadCommentContainer>
            {thread.comments.map((comment, index) => (
              <CommentEditor
                key={comment.id}
                comment={comment}
                isActive={isFocused && engine.comment.focusTargetComment === comment.id}
                isEditing={editingCommentID === comment.id}
                withResolve={index === 0}
                setEditingID={setEditingCommentID}
                isThreadEditing={!!editingCommentID || isReplying}
              />
            ))}
          </ThreadCommentContainer>

          <ReplySection
            ref={replyRef}
            onReply={enableReplying}
            onCancel={disableReplying}
            threadID={thread.id}
            isReplying={isReplying}
            isThreadEditing={!!editingCommentID}
          />
        </>
      ) : (
        <NewComment ref={replyRef} />
      )}
    </Container>
  );
};

export default ThreadEditor;
