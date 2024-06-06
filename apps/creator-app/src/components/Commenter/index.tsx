import { Utils } from '@voiceflow/common';
import { Box, User } from '@voiceflow/ui';
import React from 'react';

import Duration from '@/components/Duration';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import NameContainer from './NameContainer';

interface CommenterProps {
  time?: string;
  bold?: boolean;
  creatorID: number;
}

export const Commenter: React.FC<CommenterProps> = ({ time, bold = true, creatorID }) => {
  const member =
    useSelector(WorkspaceV2.active.members.memberByIDSelector, { creatorID }) ?? WorkspaceV2.UNKNOWN_MEMBER_DATA;

  return (
    <Box.Flex>
      <User user={member} />
      <NameContainer fontWeight={bold ? 600 : 'normal'}>{Utils.string.capitalizeAllWords(member.name)}</NameContainer>

      {time && (
        <Box ml={8}>
          <Duration time={time} short={!!time} />
        </Box>
      )}
    </Box.Flex>
  );
};

export default Commenter;
