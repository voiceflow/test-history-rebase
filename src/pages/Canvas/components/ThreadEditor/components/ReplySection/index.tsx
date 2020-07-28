import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Text from '@/components/Text';
import { useEnableDisable } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { preventDefault } from '@/utils/dom';

import EditableComment from '../EditableComment';
import ReplySectionContainer from './ReplySectionContainer';

type ReplySectionProps = {
  threadID: string;
};

const ReplySection: React.FC<ReplySectionProps> = ({ threadID }) => {
  const engine = React.useContext(EngineContext)!;
  const [isReplying, enableReplying, disableReplying] = useEnableDisable(false);

  const onClick = preventDefault(() => enableReplying());

  return isReplying ? (
    <EditableComment
      isEditing
      onSave={async (values) => {
        await engine.comment.createComment(threadID, values);
        disableReplying();
      }}
      headerProps={{
        isPosted: !isReplying,
      }}
    />
  ) : (
    <ReplySectionContainer onClick={onClick}>
      <Text color="#8da2b5">Reply</Text>
      <SvgIcon icon="prompt" color="#becedc" />
    </ReplySectionContainer>
  );
};

export default ReplySection;
