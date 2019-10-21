import { css, styled } from '@/hocs';

export const PORT_SIZE = 25;

const activeStyles = css`
  background: #dce3eb;
`;

const PortContainer = styled.div`
  height: ${PORT_SIZE}px;
  width: ${PORT_SIZE}px;
  border-radius: 0 5px 5px 0;
  background: rgba(224, 231, 239, 0.5);
  cursor: pointer;
  pointer-events: auto;

  ${({ isActive }) => isActive && activeStyles}

  &:hover {
    ${activeStyles}
  }
`;

export default PortContainer;
