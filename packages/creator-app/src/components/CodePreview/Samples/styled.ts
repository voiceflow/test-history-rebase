import { FlexApart, Preview } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Header = styled(FlexApart)`
  background-color: ${Preview.Colors.GREY_DARK_BACKGROUND_COLOR};
  padding: 12px 24px;
`;

export const Option = styled.div<{ active: boolean }>`
  color: ${Preview.Colors.GREY_TEXT_COLOR};
  display: inline-block;
  border-radius: 6px;
  padding: 6px 16px;
  cursor: pointer;
  font-weight: 600;

  :hover {
    opacity: 0.8;
  }

  ${transition('color', 'background-color', 'opacity')};

  ${({ active }) =>
    active &&
    css`
      background-color: ${Preview.Colors.GREY_LIGHT_BACKGROUND_COLOR};
      cursor: default;
      opacity: 1 !important;
    `}
`;
