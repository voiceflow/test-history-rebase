import { flexCenterStyles } from '@/components/Flex';
import { css, styled } from '@/hocs';

const CanvasMenuHandle = styled.div`
  ${flexCenterStyles}

  position: absolute;
  right: -${({ theme }) => theme.components.menuHandle.width}px;

  height: 100%;
  width: ${({ theme }) => theme.components.menuHandle.width}px;
  z-index: 30;
  cursor: ${({ isHidden }) => (isHidden ? 'e' : 'w')}-resize;

  ${({ isHidden }) =>
    isHidden &&
    css`
      background-color: #fff;
      border-right: 1px solid #dfe3ed;
    `}

  &::after {
    top: 50%;
    right: 6px;
    height: 20px;
    width: 4px;
    border-radius: 3px;
    background-image: linear-gradient(-180deg, rgba(110, 132, 154, 0.85), #6e849a);
    transform: translateY(-50%);
    opacity: 0.5;
    content: '';
  }

  &:hover::after {
    background-image: linear-gradient(-180deg, rgba(93, 157, 245, 0.85), #5d9df5);
    opacity: 1;
  }
`;

export default CanvasMenuHandle;
