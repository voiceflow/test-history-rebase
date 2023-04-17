import { Button, FlexApart, Input, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const Container = styled(FlexApart)`
  flex: 2;
  padding-left: 27px;
  min-width: 500px;
  justify-content: space-between;
`;

export const TrashButton = styled(Button)`
  display: inline-block;
  padding: 10px 20px !important;
`;

export const SearchInput = styled(Input)`
  padding: 0;
  min-width: 215px;
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
