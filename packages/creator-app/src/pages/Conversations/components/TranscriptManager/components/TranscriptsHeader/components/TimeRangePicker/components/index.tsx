import { Button, ClickableText, FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs';
import THEME from '@/styles/theme';

export const DayPickerContainer = styled.div`
  border-radius: 5px;
  background-color: ${THEME.backgrounds.white};
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  z-index: 1100 !important;
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
