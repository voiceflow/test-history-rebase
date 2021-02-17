import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { BlockVariant } from '@/constants/canvas';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import { connect, styled, transition } from '@/hocs';
import { useTheme } from '@/hooks';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import {
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_PROTOTYPE_RUNNING_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_MERGE_TARGET_CLASSNAME,
} from '../constants';

const Container = styled.div`
  ${transition('opacity')}

  opacity: 0;

  .${CANVAS_PROTOTYPE_RUNNING_CLASSNAME} & {
    display: none;
  }

  .${ClassName.CANVAS_BLOCK}:hover & {
    opacity: 1;
  }

  .${NODE_HOVERED_CLASSNAME} &,
  .${NODE_MERGE_TARGET_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} & {
    pointer-events: none;
    opacity: 0 !important;
  }
`;

type PlayButtonProps = {
  nodeID?: string;
  variant?: BlockVariant;
};

const PlayButton: React.FC<ConnectedPlayButtonProps & PlayButtonProps> = ({ nodeID, variant, updatePrototype, goToPrototype }) => {
  const theme = useTheme();

  return (
    <Container>
      <TippyTooltip title="Start test from here">
        <SvgIcon
          icon="play"
          clickable
          color={theme.components.block.variants[variant || BlockVariant.STANDARD].color}
          onClick={(e) => {
            e.stopPropagation();

            updatePrototype({ autoplay: true });
            goToPrototype(nodeID);
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
