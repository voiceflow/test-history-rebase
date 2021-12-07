import { css, styled } from '@/hocs';
import { PORT_HIGHLIGHTED_CLASSNAME, PORT_PROTOTYPE_END_UNLINKED_CLASSNAME } from '@/pages/Canvas/constants';

import { PORT_SIZE } from '../constants';

const PORT_LEFT_PADDING = 12;
const PORT_HIGHLIGHT_COLOR = '#5d9df5';
const PORT_COLOR = '#6e849a';
const PORT_BACKGROUND_COLOR = '#62778c';
const UNLINKED_END_PORT_COLOR = '#d94c4c';

const getPortColor = ({ color = PORT_COLOR }) => color;
const getBackgroundColor = ({ color = PORT_BACKGROUND_COLOR }) => color;

export interface PortConnectorContainerProps {
  color?: string;
  isConnected?: boolean;
}

const PortConnectorContainer = styled.div<PortConnectorContainerProps>`
  position: absolute;
  display: block;
  top: 50%;
  left: ${PORT_SIZE / 2 + PORT_LEFT_PADDING}px;
  transform: translate(-50%, -50%);
  box-sizing: content-box;
  box-shadow: 0 0 0 1px ${getPortColor};
  border-radius: 50%;

  .${PORT_PROTOTYPE_END_UNLINKED_CLASSNAME} && {
    background: ${UNLINKED_END_PORT_COLOR};
    box-shadow: 0 0 0 1px ${UNLINKED_END_PORT_COLOR};
  }

  ${({ color, isConnected }) =>
    isConnected
      ? css`
          height: 9px;
          width: 9px;
          background: linear-gradient(to bottom, ${getBackgroundColor}1f, ${getBackgroundColor}3d 100%);

          .${PORT_HIGHLIGHTED_CLASSNAME} && {
            background: linear-gradient(to bottom, ${color || PORT_HIGHLIGHT_COLOR}1f, ${color || PORT_HIGHLIGHT_COLOR}3d 100%);
            box-shadow: 0 0 0 1px ${color || PORT_HIGHLIGHT_COLOR};
          }
        `
      : css`
          height: 5px;
          width: 5px;
          background-color: ${getPortColor};
          border: 4px solid white;

          .${PORT_HIGHLIGHTED_CLASSNAME} && {
            background-color: ${color || PORT_HIGHLIGHT_COLOR};
            box-shadow: 0 0 0 1px ${color || PORT_HIGHLIGHT_COLOR};
          }
        `}
`;

export default PortConnectorContainer;
