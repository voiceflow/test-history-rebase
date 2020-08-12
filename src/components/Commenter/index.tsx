import React from 'react';

import Box, { Flex } from '@/components/Box';
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
  return (
    <Flex>
      <User user={user!} medium />
      <NameContainer>{capitalizeAllWords(user!.name)}</NameContainer>
      {time && (
        <Box ml={6}>
          <Duration time={time} short={!!time} />
        </Box>
      )}
    </Flex>
  );
};

const mapStateToProps = {
  user: Workspace.anyWorkspaceMemberSelector,
};

// eslint-disable-next-line no-empty-pattern
const mergeProps = (...[{ user: userSelector }, {}, { creatorID }]: MergeArguments<typeof mapStateToProps, {}, CommenterProps>) => ({
  user: userSelector(String(creatorID!)),
});

type ConnectedCommenterProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, {}, mergeProps)(Commenter);
