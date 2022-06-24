import { css, styled, transition } from '@/hocs';

export const TopLevelButtonContainer = styled.div<{ focused?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 21px 11px;
  border-radius: 6px;
  cursor: pointer;

  ${transition('background-color')}

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
