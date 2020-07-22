import React from 'react';

import Box, { Flex } from '@/components/Box';
import Duration from '@/components/Duration';
import Text from '@/components/Text';
import User from '@/components/User';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';
import { capitalizeAllWords } from '@/utils/string';

type CommenterProps = {
  creatorID: number;
  time?: string;
};

export const Commenter: React.FC<CommenterProps & ConnectedCommenterProps> = ({ user, time }) => {
  return (
    <Flex>
      <User user={user!} medium />
      <Text fontWeight={600} ml={12} fontSize={15}>
        {capitalizeAllWords(user!.name)}
      </Text>
      {time && (
        <Box ml={6}>
          <Duration time={time} />
        </Box>
      )}
    </Flex>
  );
};

const mapStateToProps = {
  user: Workspace.workspaceMemberSelector,
};

// eslint-disable-next-line no-empty-pattern
const mergeProps = (...[{ user: userSelector }, {}, { creatorID }]: MergeArguments<typeof mapStateToProps, {}, CommenterProps>) => ({
  user: userSelector(String(creatorID!)),
});

type ConnectedCommenterProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, {}, mergeProps)(Commenter);
