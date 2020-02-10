import { css, styled, units } from '@/hocs';

const PORT_LEFT_PADDING = 12;
const PORT_SIZE = 14;

const StepPort = styled.div`
  position: relative;
  height: ${({ theme }) => theme.components.step.minHeight}px;
  width: ${({ theme }) => PORT_LEFT_PADDING + PORT_SIZE + theme.unit * 2}px;
  cursor: copy;
  padding-left: ${PORT_LEFT_PADDING}px;
  margin: -${units(2)}px -${units(2)}px -${units(2)}px 0;

  &::before {
    position: absolute;
    display: block;
    content: '';
    top: 50%;
    left: ${PORT_SIZE / 2 + PORT_LEFT_PADDING}px;
    transform: translate(-50%, -50%);
    box-sizing: content-box;
    box-shadow: 0 0 0 1px #6e849a;
    border-radius: 50%;

    ${({ isConnected }) =>
      isConnected
        ? css`
            height: 9px;
            width: 9px;
            background: linear-gradient(to bottom, rgba(98, 119, 140, 0.12), rgba(98, 119, 140, 0.24) 100%);
          `
        : css`
            height: 5px;
            width: 5px;
            background-color: #6e849a;
            border: 4px solid white;
          `}
  }
`;

export default StepPort;
