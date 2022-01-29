import { Utils } from '@voiceflow/common';
import { Box, BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Duration from '@/components/Duration';
import User from '@/components/User';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import NameContainer from './NameContainer';

interface CommenterProps {
  time?: string;
  bold?: boolean;
  creatorID: number;
}

export const Commenter: React.FC<CommenterProps> = ({ time, bold = true, creatorID }) => {
  const user = useSelector((state) => WorkspaceV2.active.memberByIDSelector(state, { creatorID }));

  const userData = user ?? Workspace.UNKNOWN_MEMBER_DATA;

  return (
    <BoxFlex>
      <User user={userData} />
      <NameContainer fontWeight={bold ? 600 : 'normal'}>{Utils.string.capitalizeAllWords(userData.name)}</NameContainer>
      {time && (
        <Box ml={8}>
          <Duration time={time} short={!!time} />
        </Box>
      )}
    </BoxFlex>
  );
};

export default Commenter;
