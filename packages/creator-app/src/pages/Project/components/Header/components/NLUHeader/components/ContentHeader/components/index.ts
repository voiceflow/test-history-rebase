import { Button, FlexApart, Input, SvgIconContainer } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const Container = styled(FlexApart)`
  flex: 2;
  padding-left: 32px;
  min-width: 500px;
`;

export const TrashButton = styled(Button)`
  display: inline-block;
  padding: 10px 20px !important;
  margin-right: 10px;
  ${SvgIconContainer} {
    ${transition()}
    opacity: 0.55;
  }

  &:hover,
  &:active {
    ${SvgIconContainer} {
      opacity: 1;
    }
  }
`;

export const SearchInput = styled(Input)`
  padding: 21.5px 0;
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
`;

export const TrainButton = styled(Button)<{ active?: boolean }>`
  ${transition()}
  ${SvgIconContainer} {
    opacity: 0.8;
  }

  ${({ active }) =>
    active &&
    css`
      ${SvgIconContainer} {
        opacity: 1;
      }
    `}

  &:hover, &:active {
    ${SvgIconContainer} {
      opacity: 1;
    }
  }
`;
