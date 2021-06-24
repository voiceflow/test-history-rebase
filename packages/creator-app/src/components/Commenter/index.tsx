import { Box, BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Duration from '@/components/Duration';
import User from '@/components/User';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';
import { capitalizeAllWords } from '@/utils/string';

import NameContainer from './NameContainer';

type CommenterProps = {
  creatorID: number;
  time?: string;
};

export const Commenter: React.FC<CommenterProps & ConnectedCommenterProps> = ({ user, time }) => {
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

const mapStateToProps = {
  user: Workspace.anyWorkspaceMemberSelector,
};

const mergeProps = (...[{ user: userSelector }, , { creatorID }]: MergeArguments<typeof mapStateToProps, {}, CommenterProps>) => ({
  user: userSelector(String(creatorID)),
});

type ConnectedCommenterProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, {}, mergeProps)(Commenter);
