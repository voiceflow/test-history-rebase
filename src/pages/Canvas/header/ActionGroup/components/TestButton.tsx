import React from 'react';

import Box from '@/components/Box';
import Button from '@/components/Button';
import { Icon, Label } from '@/components/Button/components/PrimaryButton/components';
import * as SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import * as Router from '@/ducks/router';
import { connect, css, styled } from '@/hocs';
import { Spin } from '@/styles/animations';
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
  return (
    <TippyTooltip html={<Box width={180}>Test your Action on your own device, or on the Action developer console</Box>} position="bottom">
      <PlayButton
        icon="play"
        onClick={() => {
          goToPrototype();
        }}
        iconProps={{ size: 11 }}
      >
        Test
      </PlayButton>
    </TippyTooltip>
  );
};

const mapDispatchToProps = {
  goToPrototype: Router.goToCurrentPrototype,
};

type ConnectedTestButtonProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TestButton);
