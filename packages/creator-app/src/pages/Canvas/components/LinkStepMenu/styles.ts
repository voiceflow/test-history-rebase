import { MenuItem, SvgIcon, Text } from '@voiceflow/ui';

import { css, keyframes, styled, transition } from '@/hocs';

export const ArrowSvgContainer = styled(SvgIcon)`
  color: #6e849a;
  opacity: 0.65;
`;

const buttonContainerActiveStyles = css`
  background-color: rgba(238, 244, 246, 0.85);
  > ${ArrowSvgContainer} {
    ${transition('transform')}
    transform: translateX(8px);
    opacity: 1;
  }
`;

export const MenuButtonContainer = styled(MenuItem)<{ focused?: boolean }>`
  justify-content: space-between;
  &:hover,
  &:focus {
    ${buttonContainerActiveStyles}
  }

  ${({ focused }) => focused && buttonContainerActiveStyles}
`;

export const StyledText = styled(Text)<{ disabled: boolean }>`
  display: block;
  padding-left: 12px;
  width: 100%;
  max-width: 230px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  ${({ disabled }) =>
    disabled &&
    css`
      color: #62778c;
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

export const TooltipContainer = styled.div`
  max-width: 232px;
  position: relative;
  display: block;
  padding: 8px 16px;
  left: 50%;
  font-size: 13px;
  border-radius: 6px;
  background-color: #33373a;
  perspective: 800px;
  transform-origin: -50% 0;
  animation: ${animation} 0.12s cubic-bezier(0.165, 0.84, 0.44, 1);
  animation-fill-mode: both;
`;
