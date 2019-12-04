import React from 'react';

import { Members } from '@/components/User/User';
import Flex from '@/componentsV2/Flex';
import { WorkspaceLoadingGate, WorkspaceMembersLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { activeDiagramViewersSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';

const CanvasViewers = ({ viewers }) => (
  <Flex>
    <Members members={viewers} />
  </Flex>
);

const mapStateToProps = {
  viewers: activeDiagramViewersSelector,
};

export default compose(
  withBatchLoadingGate(WorkspaceLoadingGate, WorkspaceMembersLoadingGate),
  connect(mapStateToProps)
)(CanvasViewers);
