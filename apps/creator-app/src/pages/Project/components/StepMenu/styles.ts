import { css, styled } from '@/hocs/styled';
import { ClassName } from '@/styles/constants';

export const StepMenuExpandButton = styled.div`
  transition: height 0.2s ease, opacity 0.2s ease;

  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .${ClassName.SVG_ICON} {
    opacity: 0.65;
  }

  &:hover {
    .${ClassName.SVG_ICON} {
      opacity: 0.8;
    }
  }
`;

export const TopLevelInnerContainer = styled.div<{ size: number }>`
  padding: 4px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 1px 3px 1px rgba(19, 33, 68, 0.01), 0 5px 8px -8px rgba(19, 33, 68, 0.12), 0 2px 4px -3px rgba(19, 33, 68, 0.12),
    0 0 0 1px rgba(19, 33, 68, 0.03);
  overflow: hidden;
  transition: height 0.15s ease;

  & + & {
    margin-top: 4px;
  }

  ${({ size }) => css`
    height: ${size * 64 + 8}px;
  `}
`;

export const TopLevelOuterContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 100%;
  transform: translateX(12px);
  padding: 4px;
  border-radius: 10px;
  background-color: rgba(231, 238, 239, 0.8);
  z-index: 10;

  ${StepMenuExpandButton} {
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    & ${StepMenuExpandButton} {
      height: 20px;
      opacity: 1;
      pointer-events: all;
      margin-bottom: -4px;
    }
  }
`;
