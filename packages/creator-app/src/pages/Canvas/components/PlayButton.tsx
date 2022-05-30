import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import { connect, styled } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import {
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_PROTOTYPE_RUNNING_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_MERGE_TARGET_CLASSNAME,
} from '../constants';

const Container = styled.div`
  transition: max-width 0.12s ease, margin-right 0.12s ease, opacity 0.12s ease;
  max-width: 0;
  margin-right: 0;
  opacity: 0;
  overflow: hidden;
  overflow: clip;

  .${CANVAS_PROTOTYPE_RUNNING_CLASSNAME} & {
    display: none;
  }

  .${ClassName.CANVAS_BLOCK}:hover & {
    max-width: 16px;
    opacity: 1;

    &:not(:last-child) {
      margin-right: 12px;
    }
  }

  .${NODE_HOVERED_CLASSNAME} &,
  .${NODE_MERGE_TARGET_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} & {
    pointer-events: none;
    max-width: 0 !important;
    margin-right: 0 !important;
  }
`;

interface PlayButtonProps {
  nodeID?: string;
  palette: HSLShades;
}

const PlayButton: React.FC<ConnectedPlayButtonProps & PlayButtonProps> = ({ nodeID, palette, updatePrototype, goToPrototype }) => {
  const [trackingEvents] = useTrackingEvents();

  return (
    <Container>
      <TippyTooltip title="Start test from here">
        <SvgIcon
          icon="play"
          clickable
          color={palette[700]}
          style={{ transform: 'scale(1.2)' }}
          onClick={(e) => {
            e.stopPropagation();

            updatePrototype({ autoplay: true });
            goToPrototype(nodeID);

            trackingEvents.trackProjectBlockPrototypeTestStart();
          }}
        />
      </TippyTooltip>
    </Container>
  );
};

const mapDispatchProps = {
  updatePrototype: Prototype.updatePrototype,
  goToPrototype: Router.goToCurrentPrototype,
};

type ConnectedPlayButtonProps = ConnectedProps<{}, typeof mapDispatchProps>;

export default connect(null, mapDispatchProps)(PlayButton) as React.FC<PlayButtonProps>;
