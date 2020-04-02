import { css, styled, units } from '@/hocs';

const PORT_LEFT_PADDING = 12;
const PORT_SIZE = 14;

export type PortContainerProps = {
  color?: string;
  isConnected?: boolean;
  isHighlighted?: boolean;
};

const getPortColor = ({ isHighlighted, color = '#6e849a' }: PortContainerProps) => (isHighlighted ? '#5d9df5' : color);
const getBackgroundColor = ({ isHighlighted, color = '#62778c' }: PortContainerProps) => (isHighlighted ? '#5d9df5' : color);

const PortContainer = styled.div<PortContainerProps>`
  position: relative;
  height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  width: ${({ theme }) => PORT_LEFT_PADDING + PORT_SIZE + theme.unit * 2}px;
  margin: -${units(2)}px -${units(2)}px -${units(2)}px 0;
  padding-left: ${PORT_LEFT_PADDING}px;
  align-self: center;
  cursor: copy;

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
        ? css<PortContainerProps>`
            height: 9px;
            width: 9px;
            background: linear-gradient(to bottom, ${getBackgroundColor}1f, ${getBackgroundColor}3d 100%);
          `
        : css<PortContainerProps>`
            height: 5px;
            width: 5px;
            background-color: ${getPortColor};
            border: 4px solid white;
          `}
  }
`;

export default PortContainer;
