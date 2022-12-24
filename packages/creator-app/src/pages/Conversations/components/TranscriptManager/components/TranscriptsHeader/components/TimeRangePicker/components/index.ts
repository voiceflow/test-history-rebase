import { Button, ClickableText, FlexApart, Popper } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import THEME from '@/styles/theme';

export const DayPickerContainer = styled.div`
  ${Popper.baseStyles}
  background-color: ${THEME.backgrounds.white};
  z-index: ${({ theme }) => theme.zIndex.popper} !important;
  left: 20px !important;
  padding-top: 10px;

  & > * {
    outline: none !important;
  }
`;

export const ClearRangeLink = styled(ClickableText)`
  padding: 21px 22px;
`;

export const ApplyButton = styled(Button)``;

export const CalendarFooter = styled(FlexApart)`
  height: 90px;
  background-color: ${THEME.backgrounds.gray};
  padding: 24px 32px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;
