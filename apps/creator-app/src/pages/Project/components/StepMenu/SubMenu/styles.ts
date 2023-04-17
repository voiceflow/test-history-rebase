import { SvgIcon, Text } from '@voiceflow/ui';

import { css, keyframes, styled } from '@/hocs/styled';

interface SubMenuContainerProps {
  defaultPadding?: number;
  width?: number;
}

export const SubMenuContainer = styled.div<SubMenuContainerProps>`
  border-radius: 8px;
  background-color: white;
  height: fit-content;
  min-width: 154px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 8px;
  box-shadow: 0 0 0 1px rgba(19, 33, 68, 0.04), 0 1px 0 0 rgba(19, 33, 68, 0.02), 0 1px 5px -4px rgba(19, 33, 68, 0.08),
    0 2px 8px -6px rgba(19, 33, 68, 0.24), 0 1px 3px 1px rgba(19, 33, 68, 0.01);
  animation: fadein 0.15s ease, movein 0.15s ease, scaleY 0.1s ease;

  ${({ defaultPadding = 6 }) => css`
    padding: ${defaultPadding}px;
  `}

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
`;

const animation = keyframes`
  from {
    transform: scale(0) translate(-50%, 0);
    opacity: 0.15;
  }

  to {
    transform: scale(1) translate(-50%, 0);
    opacity:1;
  }
`;

export const TooltipContainer = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  position: relative;
  display: block;
  padding: 8px 16px;
  left: 50%;
  font-size: 13px;
  border-radius: 8px;
  background-color: #33373a;
  perspective: 800px;
  transform-origin: -50% 0;
  animation: ${animation} 0.12s cubic-bezier(0.165, 0.84, 0.44, 1);
  animation-fill-mode: both;
`;

export const StyledText = styled(Text)<{ disabled?: boolean }>`
  padding-left: 12px;
  width: 100%;
  font-size: 15px;
  line-height: 12px;

  ${({ disabled }) =>
    disabled &&
    css`
      color: #62778c;
    `}
`;

export const ContextMenuOption = styled.div<{ isActive?: boolean }>`
  display: flex;
  gap: 21px;
  align-items: center;
  position: relative;

  ${({ isActive }) =>
    isActive &&
    css`
      ${SvgIcon.Container} {
        transform: translateX(8px);
        opacity: 1;
        color: #6e849a;
      }
    `}
`;
