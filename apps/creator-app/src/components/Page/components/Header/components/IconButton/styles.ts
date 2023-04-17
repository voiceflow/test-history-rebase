import { Box, System } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';
import { ClassName } from '@/styles/constants';

export const Container = styled(Box.Flex)`
  position: relative;
  height: 100%;

  .${ClassName.TOOLTIP} {
    height: 100%;
  }
`;

export interface ButtonProps extends System.IconButton.I.Props {
  withBadge?: boolean;
}

export const Button = styled(System.IconButton.Base)<ButtonProps>`
  ${({ onClick }) =>
    !onClick &&
    css`
      pointer-events: none;
    `}

  ${({ withBadge }) =>
    withBadge &&
    css`
      position: relative;

      &:after {
        position: absolute;
        top: 50%;
        right: 50%;
        display: block;
        width: 6px;
        height: 6px;
        margin-top: -9px;
        margin-right: -10px;
        border: solid 1px #fff;
        border-radius: 6px;
        background-image: linear-gradient(to bottom, rgba(224, 79, 120, 0.85), #e04f78 99%);
        content: '';
      }
    `}
`;

const activeStyles = css`
  opacity: 1;

  .${ClassName.SVG_ICON} {
    transform: translate(2px, 2px);
  }
`;

interface ExpandContainerProps {
  isActive?: boolean;
}

export const ExpandIconContainer = styled(Box.FlexCenter)<ExpandContainerProps>`
  ${transition('opacity')}

  width: 15px;
  height: 15px;
  position: absolute;
  padding-right: 1px;
  padding-bottom: 1px;
  right: 0px;
  bottom: 0px;
  opacity: 0.6;
  z-index: 1;
  cursor: pointer;

  .${ClassName.SVG_ICON} {
    ${transition('transform')}
  }

  ${({ isActive }) => isActive && activeStyles}

  ${({ onClick }) =>
    !onClick &&
    css`
      pointer-events: none;
    `}

  &:hover {
    ${activeStyles}
  }
`;
