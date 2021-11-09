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
  creatorID: number;
}

export const Commenter: React.FC<CommenterProps> = ({ time, creatorID }) => {
  const user = useSelector((state) => WorkspaceV2.active.memberByIDSelector(state, { creatorID }));

  const userData = user ?? Workspace.UNKNOWN_MEMBER_DATA;

  return (
    <BoxFlex>
      <User user={userData} medium />
      <NameContainer>{Utils.string.capitalizeAllWords(userData.name)}</NameContainer>
      {time && (
        <Box ml={6}>
          <Duration time={time} short={!!time} />
        </Box>
      )}
    </BoxFlex>
  );
};

export default Commenter;
