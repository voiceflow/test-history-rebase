import React from 'react';

import Flex from '@/components/Flex';
import Text from '@/components/Text';
import User from '@/components/User';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

type CommenterProps = {
  creatorID: number;
};

const Commenter: React.FC<CommenterProps & ConnectedCommenterProps> = ({ user }) => {
  return (
    <Flex>
      <User user={user!} medium />
      <Text fontWeight={600} ml={12} fontSize={15}>
        {user!.name}
      </Text>
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
