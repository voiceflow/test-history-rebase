import { Utils } from '@voiceflow/common';
import { Box, User } from '@voiceflow/ui';
import React from 'react';

import Duration from '@/components/Duration';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import NameContainer from './NameContainer';

interface CommenterProps {
  time?: string;
  bold?: boolean;
  creatorID: number;
}

export const Commenter: React.OldFC<CommenterProps> = ({ time, bold = true, creatorID }) => {
  const user = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });

  const userData = user ?? Workspace.UNKNOWN_MEMBER_DATA;

  return (
    <Box.Flex>
      <User user={userData} />
      <NameContainer fontWeight={bold ? 600 : 'normal'}>{Utils.string.capitalizeAllWords(userData.name)}</NameContainer>
      {time && (
        <Box ml={8}>
          <Duration time={time} short={!!time} />
        </Box>
      )}
    </Box.Flex>
  );
};

export default Commenter;
