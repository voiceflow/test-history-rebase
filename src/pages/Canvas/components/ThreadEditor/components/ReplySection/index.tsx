import React from 'react';

import Box from '@/components/Box';
import MentionEditor from '@/components/MentionEditor';
import SvgIcon from '@/components/SvgIcon';
import Text from '@/components/Text';
import { Permission } from '@/config/permissions';
import { useEnableDisable } from '@/hooks';
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';

import ThreadEditorHeader from '../ThreadEditorHeader';
import ReplySectionContainer from './ReplySectionContainer';

type ReplySectionProps = {
  threadID: string;
};

const ReplySection: React.FC<ReplySectionProps> = ({ threadID }) => {
  const [isReplying, enableReplying, disableReplying] = useEnableDisable(false);

  const { newReply, setNewValues, resetNewValues, postComment } = React.useContext(CommentModeContext);

  const doneReplying = async () => {
    await postComment();

    resetNewValues(true);
    disableReplying();
  };

  const onClick = () => {
    enableReplying();
    setNewValues({ threadID }, true);
  };

  const onBlur = () => {
    if (!newReply?.text) {
      disableReplying();
      resetNewValues(true);
    }
  };

  return isReplying ? (
    <Box>
      <ThreadEditorHeader threadID={threadID} onPost={doneReplying} isPosted={!isReplying} />
      <Box mt={12}>
        <MentionEditor
          permissiongType={Permission.COMMENTING}
          onChange={(text: string, mentions: number[]) => setNewValues({ ...newReply, text, mentions }, true)}
          placeholder="Reply or @mention"
          value={newReply?.threadID && newReply?.text}
          onBlur={onBlur}
        />
      </Box>
    </Box>
  ) : (
    <ReplySectionContainer onClick={onClick}>
      <Text color="#8da2b5">Reply</Text>
      <SvgIcon icon="prompt" color="#becedc" />
    </ReplySectionContainer>
  );
};

export default ReplySection;
