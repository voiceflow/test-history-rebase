import React from 'react';
import { Tooltip } from 'react-tippy';

import { User } from '@/components/User/User';
import Flex from '@/componentsV2/Flex';
import { withTeamLoaded } from '@/contexts/TeamLoadingGate';
import { connect } from '@/hocs';
import { diagramViewersSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';

const CanvasViewers = ({ viewers }) => (
  <Flex>
    {viewers.map((viewer) => (
      <Tooltip title={viewer.name} position="bottom" key={viewer.tabID}>
        <User user={viewer} />
      </Tooltip>
    ))}
  </Flex>
);

const mapStateToProps = {
  viewers: diagramViewersSelector,
};

export default compose(
  withTeamLoaded,
  connect(mapStateToProps)
)(CanvasViewers);
