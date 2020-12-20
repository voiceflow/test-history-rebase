import React from 'react';

import Button from '@/components/Button';
import { Icon, Label } from '@/components/Button/components/PrimaryButton/components';
import * as SvgIcon from '@/components/SvgIcon';
import Tooltip from '@/components/TippyTooltip';
import * as Router from '@/ducks/router';
import { connect, css, styled } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { Spin } from '@/styles/animations';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

export type PlayButtonProps = {
  isUploading?: boolean;
};

const PlayButton = styled(Button).attrs({ speed: 2000 })<PlayButtonProps>`
  ${({ isUploading }) =>
    isUploading &&
    css`
      background: linear-gradient(-180deg, #5d9df588 0%, #176ce088 68%);
      box-shadow: none;
    `}
  ${Icon} {
    background: linear-gradient(-180deg, #427fcf 0%, #125bc1 68%);
    box-shadow: none;
    ${SvgIcon.Container} {
      display: block;
      opacity: 1;
      ${({ isUploading }) => isUploading && Spin}
    }
  }
  ${Label} {
    padding-right: 20px;
    text-align: left;
  }
`;

const TestButton: React.FC<ConnectedTestButtonProps> = ({ goToPrototype }) => {
  const [trackingEvents] = useTrackingEvents();

  return (
    <Tooltip distance={6} title="Test" position="bottom" hotkey="T">
      <PlayButton
        id={Identifier.TEST}
        icon="play"
        onClick={() => {
          trackingEvents.trackActiveProjectPrototypeTestClick();
          goToPrototype();
        }}
        iconProps={{ size: 11 }}
      >
        Test
      </PlayButton>
    </Tooltip>
  );
};

const mapDispatchToProps = {
  goToPrototype: Router.goToCurrentPrototype,
};

type ConnectedTestButtonProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TestButton);
