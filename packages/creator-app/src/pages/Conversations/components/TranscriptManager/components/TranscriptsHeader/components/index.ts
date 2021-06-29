import { FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs';
import THEME from '@/styles/theme';

export { default as DatePicker } from './TimeRangePicker/DatePicker';
export { default as TranscriptFilters } from './TranscriptFilters';

export const Container = styled(FlexApart)`
  height: 72px;
  padding: 26px 32px;
  width: 100%;
  background: ${THEME.backgrounds.white};
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
`;
