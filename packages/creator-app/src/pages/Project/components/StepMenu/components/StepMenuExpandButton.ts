import { css, styled } from '@/hocs';

const StepMenuExpandButton = styled.div<{ isHovered?: boolean }>`
  transition: all 0.2s ease;

  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0.3;
  visibility: hidden;

  ${({ isHovered }) =>
    isHovered &&
    css`
      visibility: visible;
      height: 16px;
    `}

  &:hover {
    opacity: 0.5;
  }
`;

export default StepMenuExpandButton;
