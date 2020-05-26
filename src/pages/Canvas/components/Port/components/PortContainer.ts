import { css, styled, units } from '@/hocs';
import { CANVAS_MERGING_CLASSNAME, NODE_DISABLED_CLASSNAME, PORT_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';

import { PORT_SIZE } from '../constants';

const PORT_LEFT_PADDING = 12;
const PORT_HIGHLIGHT_COLOR = '#5d9df5';
const PORT_COLOR = '#6e849a';
const PORT_BACKGROUND_COLOR = '#62778c';

const getPortColor = ({ color = PORT_COLOR }) => color;
const getBackgroundColor = ({ color = PORT_BACKGROUND_COLOR }) => color;

export type PortContainerProps = {
  color?: string;
  isConnected?: boolean;
};

const PortContainer = styled.div<PortContainerProps>`
  position: relative;
  height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  width: ${({ theme }) => PORT_LEFT_PADDING + PORT_SIZE + theme.unit * 2}px;
  margin: -${units(2)}px -${units(2)}px -${units(2)}px 0;
  padding-left: ${PORT_LEFT_PADDING}px;
  align-self: center;
  cursor: copy;

  .${CANVAS_MERGING_CLASSNAME} &,
  .${NODE_DISABLED_CLASSNAME} & {
    cursor: inherit;
  }

  &::before {
    position: absolute;
    display: block;
    content: '';
    top: 50%;
    left: ${PORT_SIZE / 2 + PORT_LEFT_PADDING}px;
    transform: translate(-50%, -50%);
    box-sizing: content-box;
    box-shadow: 0 0 0 1px ${getPortColor};
    border-radius: 50%;

    ${({ isConnected }) =>
      isConnected
        ? css`
            height: 9px;
            width: 9px;
            background: linear-gradient(to bottom, ${getBackgroundColor}1f, ${getBackgroundColor}3d 100%);
          `
        : css`
            height: 5px;
            width: 5px;
            background-color: ${getPortColor};
            border: 4px solid white;
          `}
  }

  &.${PORT_HIGHLIGHTED_CLASSNAME}::before {
    box-shadow: 0 0 0 1px ${PORT_HIGHLIGHT_COLOR};

    ${({ isConnected }) =>
      isConnected
        ? css`
            background: linear-gradient(to bottom, ${PORT_HIGHLIGHT_COLOR}1f, ${PORT_HIGHLIGHT_COLOR}3d 100%);
          `
        : css`
            background-color: ${PORT_HIGHLIGHT_COLOR};
          `}
  }
`;

export default PortContainer;
