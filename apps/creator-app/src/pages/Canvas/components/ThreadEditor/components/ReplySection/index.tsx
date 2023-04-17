import { Menu, preventDefault, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { useTrackingEvents } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { CommentDraftValue } from '@/pages/Canvas/types';

import { REPLY_CLASSNAME } from '../../constants';
import Content from '../Content';
import EditableComment, { EditableCommentRef } from '../EditableComment';
import ReplySectionContainer from './ReplySectionContainer';

interface ReplySectionProps {
  onReply: VoidFunction;
  onCancel: VoidFunction;
  threadID: string;
  isReplying: boolean;
  isThreadEditing?: boolean;
}

const ReplySection: React.ForwardRefRenderFunction<EditableCommentRef, ReplySectionProps> = (
  { onReply, onCancel, threadID, isReplying, isThreadEditing },
  ref
) => {
  const engine = React.useContext(EngineContext)!;
  const editableCommentRef = React.useRef<EditableCommentRef>(null);
  const [initialValue, setInitialValue] = React.useState<string>('');
  const [initialMentions, setInitialMentions] = React.useState<number[]>([]);

  const [trackEvents] = useTrackingEvents();

  const onPost = async (text: string, mentions: number[]) => {
    await engine.comment.createComment(threadID, { text, mentions });

    trackEvents.trackNewThreadReply();
    onCancel();
  };

  const onPersistedReply = usePersistFunction(onReply);

  React.useImperativeHandle(
    ref,
    () => ({
      getDraft: () => editableCommentRef.current?.getDraft() ?? null,
      setDraft: (draft: CommentDraftValue) => {
        onPersistedReply();
        setInitialValue(draft.text);
        setInitialMentions(draft.mentions);
        editableCommentRef.current?.setDraft(draft);
      },
    }),
    []
  );

  return isReplying ? (
    <Content>
      <EditableComment
        ref={editableCommentRef}
        onPost={onPost}
        onCancel={onCancel}
        isEditing
        placeholder="Comment or @mention"
        initialValue={initialValue}
        initialMentions={initialMentions}
      />
    </Content>
  ) : (
    <ReplySectionContainer>
      <Menu.Footer.Action className={REPLY_CLASSNAME} onClick={preventDefault(onReply)} disabled={isThreadEditing}>
        Reply in Thread
      </Menu.Footer.Action>
    </ReplySectionContainer>
  );
};

export default React.forwardRef(ReplySection);
