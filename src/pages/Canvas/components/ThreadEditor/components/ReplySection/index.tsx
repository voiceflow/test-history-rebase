import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Text from '@/components/Text';
import { useEnableDisable, useTrackingEvents } from '@/hooks';
import { Comment } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';
import { preventDefault } from '@/utils/dom';

import { REPLY_CLASSNAME } from '../../constants';
import EditableComment from '../EditableComment';
import ReplySectionContainer from './ReplySectionContainer';

type ReplySectionProps = {
  threadID: string;
};

const ReplySection: React.FC<ReplySectionProps> = ({ threadID }) => {
  const engine = React.useContext(EngineContext)!;
  const [isReplying, enableReplying, disableReplying] = useEnableDisable(false);
  const [trackEvents] = useTrackingEvents();

  const onClick = preventDefault(() => enableReplying());

  const onSave = async (values: Pick<Comment, 'text' | 'mentions'>) => {
    await engine.comment.createComment(threadID, values);

    engine.comment.resetDraftComment(threadID);

    trackEvents.trackNewThreadReply();
    disableReplying();
  };

  const saveDraftValue = (values: Pick<Comment, 'text' | 'mentions'>) => engine.comment.setDraftComment(threadID, values);

  return isReplying ? (
    <EditableComment
      isEditing
      onSave={onSave}
      initialValues={engine.comment.draftComment?.[threadID]}
      onBlur={saveDraftValue}
      headerProps={{
        isPosted: !isReplying,
      }}
    />
  ) : (
    <ReplySectionContainer className={REPLY_CLASSNAME} onClick={onClick}>
      <Text color="#8da2b5">Reply</Text>
      <SvgIcon icon="commentReply" color="#becedc" />
    </ReplySectionContainer>
  );
};

export default ReplySection;
