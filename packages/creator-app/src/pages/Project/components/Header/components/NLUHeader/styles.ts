import { Button, ButtonVariant, FlexApart, Input, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

export const Container = styled(FlexApart)`
  flex: 2;
  padding-left: 32px;
  min-width: 500px;
  justify-content: space-between;
`;

export const TrashButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY })`
  display: inline-block;
  padding: 10px 20px !important;

  svg {
    ${transition('opacity', 'color')}
    color: #8194a8;
    opacity: 0.85;
  }

  &:hover svg {
    opacity: 1;
  }
`;

export const SearchInput = styled(Input)`
  padding: 0;
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
`;

export const TrainButton = styled(Button)<{ active?: boolean }>`
  ${transition()}
  ${SvgIcon.Container} {
    opacity: 1;
  }

  &:hover,
  &:active {
    ${SvgIcon.Container} {
      opacity: 1;
    }
  }
`;
