/* eslint-disable import/prefer-default-export */
import { transition } from '@ui/styles';
import { isHexColor } from '@ui/utils/colors/hex';
import React from 'react';
import styled from 'styled-components';

import TippyTooltip from '../../../TippyTooltip';
// import { AddNamePopper } from '../Poppers/AddNamePopper';
import { Tooltip, WrapperTooltip } from './styles';
import { BaseColorProps, ColorProps } from './types';

const ColorCircle = styled.div<BaseColorProps>`
  ${({ small }) =>
    small
      ? `
          width: 18px;
          height: 18px;
        `
      : `
          width: 22px;
          height: 22px;
        `}

  position: relative;
  border-radius: 50%;
  box-shadow: inset 0 -2px 0 0 #0000001e;
  background: ${({ background }) => background};
  background-blend-mode: screen;
  cursor: pointer;
`;

const ColorWrapper = styled.div<ColorProps>`
  ${transition('transform')}

  border-radius: 50%;
  border: solid 2px;
  padding: ${({ small }) => (small ? '2px' : '3.5px')};
  ${({ selected, background }) =>
    selected
      ? `
        border-color: #3d82e2;
      `
      : `
        border-color: ${background}22;
        background: ${background}22;
      `}

  &:hover {
    transform: scale(1.1);
  }
`;

export const Color: React.FC<ColorProps> = (props: ColorProps): React.ReactElement => {
  return (
    <TippyTooltip
      disabled={!props.name}
      html={
        <WrapperTooltip>
          <Tooltip>{props.name}</Tooltip>
        </WrapperTooltip>
      }
    >
      <ColorWrapper {...props} background={isHexColor(props.background) ? props.background : '#a7a7a7'}>
        <ColorCircle background={props.background} small={props.small} />
      </ColorWrapper>

      {/* {props.colorData?.editing && <AddNamePopper isEditing />} */}
    </TippyTooltip>
  );
};
