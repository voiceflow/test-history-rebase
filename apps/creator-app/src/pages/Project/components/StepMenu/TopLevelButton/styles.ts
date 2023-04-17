import { FlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const ButtonContainer = styled(FlexCenter)<{ focused?: boolean }>`
  ${transition('background-color')}

  width: 64px;
  height: 64px;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;

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
