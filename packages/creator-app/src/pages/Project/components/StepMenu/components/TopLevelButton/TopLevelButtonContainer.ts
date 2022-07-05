import { css, styled, transition } from '@/hocs';

export const TopLevelButtonContainer = styled.div<{ focused?: boolean; visible: boolean }>`
  border-radius: 6px;
  cursor: pointer;
  width: 64px;
  height: 64px;
  padding-top: 12px;
  padding-bottom: 11px;
  text-align: center;
  visibility: none;
  display: none;

  transition: all 0.2s ease;

  ${transition('background-color')}

  ${({ visible }) =>
    visible &&
    css`
      display: block;
      visibility: visible;
    `}

  &:hover,
  &:focus {
    background-color: rgba(238, 244, 246, 0.85);
  }

  ${({ focused }) =>
    focused &&
    css`
      background-color: rgba(238, 244, 246, 0.85);
    `}
`;
