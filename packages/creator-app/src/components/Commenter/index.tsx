import { Box, BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Duration from '@/components/Duration';
import User from '@/components/User';
import { FeatureFlag } from '@/config/features';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Workspace from '@/ducks/workspace';
import { useFeature, useRealtimeSelector, useSelector } from '@/hooks';
import { capitalizeAllWords } from '@/utils/string';

import NameContainer from './NameContainer';

interface CommenterProps {
  time?: string;
  creatorID: number;
}

export const Commenter: React.FC<CommenterProps> = ({ time, creatorID }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const userV1 = useSelector((state) => Workspace.anyWorkspaceMemberSelector(state)(String(creatorID)));
  const userRealtime = useRealtimeSelector((state) => RealtimeWorkspace.workspaceMemberByCreatorIDSelector(state, { creatorID }));

  const user = atomicActions.isEnabled ? userRealtime : userV1;

  const userData = user ?? Workspace.UNKNOWN_MEMBER_DATA;

  return (
    <BoxFlex>
      <User user={userData} medium />
      <NameContainer>{capitalizeAllWords(userData.name)}</NameContainer>
      {time && (
        <Box ml={6}>
          <Duration time={time} short={!!time} />
        </Box>
      )}
    </BoxFlex>
  );
};

export default Commenter;
