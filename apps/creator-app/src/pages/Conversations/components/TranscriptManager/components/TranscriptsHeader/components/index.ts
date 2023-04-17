import { FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export { default as DatePicker } from './TimeRangePicker/DatePicker';
export type { TranscriptFiltersProps } from './TranscriptFilters';
export { default as TranscriptFilters } from './TranscriptFilters';

export const Container = styled(FlexApart)`
  height: ${({ theme }) => theme.components.page.header.height}px;
  padding: 26px 32px;
  width: 100%;
  background: ${({ theme }) => theme.backgrounds.white};
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
  z-index: 1;
  transition: box-shadow 0.2s ease-in-out;
`;
