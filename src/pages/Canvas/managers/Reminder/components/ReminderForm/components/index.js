import Select from '@/components/Select';
import { styled } from '@/hocs';

import GridContainer from './GridContainer';

export { default as WeeklySelection } from './WeeklySelection';

export { default as ReminderContent } from './ReminderContent';

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
`;

export const TimeLabel = styled.label`
  margin-bottom: 3px;
  max-width: 130px;
  margin-right: 5px;
  font-size: 13px !important;
`;

export const VariableInputContainer = styled.div`
  width: ${({ width }) => width}px;
`;

export const RecurrenceContainer = styled.div`
  padding-bottom: 20px;
`;
