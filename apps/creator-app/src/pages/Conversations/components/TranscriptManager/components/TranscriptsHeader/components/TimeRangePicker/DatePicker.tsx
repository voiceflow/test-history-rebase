import { TimeRange } from '@voiceflow/internal';
import type { PopperTypes } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';
import type { DateRange } from 'react-day-picker';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import { isBuiltInRange } from '@/pages/Conversations/constants';

const TimeRangeSelect: any = DropdownMultiselect;

const TIME_RANGE_OPTIONS = [
  { label: 'Today', value: TimeRange.TODAY },
  { label: 'Yesterday', value: TimeRange.YESTERDAY },
  { label: 'Last 7 days', value: TimeRange.WEEK },
  { label: 'Last 30 days', value: TimeRange.MONTH },
  { label: 'All time', value: TimeRange.ALLTIME },
];

const initialRange = { from: undefined, to: undefined, enteredTo: undefined };

export interface DayPickerInputProps {
  onChange: (input: TimeRange | string) => void;
  placement?: PopperTypes.Placement;
  currentRange: string;
}

const DatePicker: React.FC<DayPickerInputProps> = ({ onChange, currentRange }) => {
  const getDefaultRange = (): DateRange & { enteredTo?: Date | null } => {
    if (!currentRange || isBuiltInRange(currentRange)) return initialRange;

    const date = currentRange.split('-');
    const to = dayjs(date[1]);
    const from = dayjs(date[0]);

    if (!from.isValid() || !to.isValid()) return initialRange;

    return { from: from.toDate(), to: to.toDate(), enteredTo: to.toDate() };
  };

  const [range] = React.useState(() => getDefaultRange());
  const [input, setInput] = React.useState<TimeRange | string>(currentRange);
  const [isOpen] = React.useState(false);

  const onChangeInput = (input: TimeRange | string) => {
    setInput(input);
    onChange(input);
  };

  const setRangeInput = (range: DateRange) => {
    const end = range.to ? range.to?.toLocaleDateString() : '';
    const start = range.from ? range.from?.toLocaleDateString() : '';

    onChangeInput(start ? `${start} - ${end}` : '');
  };

  const setTimeRange = (timeRange: TimeRange | string) => {
    if (timeRange === TimeRange.CUSTOM) {
      setRangeInput(range);
    } else {
      onChangeInput(timeRange);
    }
  };

  return (
    <TimeRangeSelect
      open={isOpen}
      options={TIME_RANGE_OPTIONS}
      onSelect={(timeRange: TimeRange) => setTimeRange(timeRange)}
      withCaret
      autoWidth
      selfDismiss
      placeholder="Time Range"
      isTranscript
      selectedValue={input}
      selectedItems={input}
      dropdownActive
      multiSelectDisabled={true}
    />
  );
};

export default DatePicker;
