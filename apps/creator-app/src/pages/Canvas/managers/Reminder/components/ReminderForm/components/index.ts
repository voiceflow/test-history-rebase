import { Select } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import GridContainer from './GridContainer';

export { default as ReminderContent } from './ReminderContent';
export { default as WeeklySelection } from './WeeklySelection';

export const TimeContainer = styled(GridContainer)`
  margin-bottom: 0px;
  margin-right: 40px;
  grid-template-columns: 1fr 1.1fr 1fr;
`;

export const TimeZoneContainer = styled(GridContainer)`
  margin-bottom: 10px;
  grid-template-columns: 1fr 2fr !important;
`;

export const TimeZoneSelection = styled(Select)`
  margin-right: 70px;
` as typeof Select;

export const TimeLabel = styled.label`
  margin-bottom: 3px;
  max-width: 130px;
  margin-right: 5px;
  font-size: 13px !important;
`;

export const VariableInputContainer = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
`;

export const RecurrenceContainer = styled.div`
  padding-bottom: 20px;
`;
