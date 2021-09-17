import { TimeRange } from '@voiceflow/internal';
import { ButtonVariant } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';
import { DateUtils, Modifier, RangeModifier } from 'react-day-picker';

import { TimeRangePicker, WEEKDAYS } from '@/components/DayPickerInput/components';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import Popper, { PopperContent, PopperProps } from '@/components/Popper';
import { useEnableDisable } from '@/hooks';
import { isBuiltInRange } from '@/pages/Conversations/constants';

import { ApplyButton, CalendarFooter, ClearRangeLink, DayPickerContainer } from './components';

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
  currentRange?: string | Date;
  placement?: PopperProps['placement'];
  onChange: (input: TimeRange | string) => void;
}

const DatePicker: React.FC<DayPickerInputProps> = ({ currentRange, placement, onChange }) => {
  const variablesInputRef = React.useRef<{ blur: Function; getEditorState: Function } | null>(null);
  const [calendarOpened, onShowCalendar, onHideCalendar] = useEnableDisable(false);

  const getDefaultRange = () => {
    if (!currentRange || isBuiltInRange(currentRange as string)) return initialRange;

    const date = (currentRange as string).split('-');
    const from = dayjs(date[0]);
    const to = dayjs(date[1]);

    if (!from.isValid() || !to.isValid()) return initialRange;

    return { from: from.toDate(), to: to.toDate(), enteredTo: to.toDate() };
  };

  const [range, setRange] = React.useState(getDefaultRange() as RangeModifier & { enteredTo?: Date });

  const [isOpen, setIsOpen] = React.useState(false);

  const modifiers: Partial<Modifier> = {
    start: range.from,
    end: range.enteredTo,
    saturdays: { daysOfWeek: [6] },
    sundays: { daysOfWeek: [0] },
  };

  const disabledDays = { before: range.from } as Modifier;
  const selectedDays = [range.from, { from: range.from, to: range.enteredTo }] as Modifier[];
  const initialMonth = range.from || new Date();

  const [input, setInput] = React.useState(currentRange as TimeRange | string);

  const setRangeInput = (range: RangeModifier) => {
    const start = range.from ? range.from?.toLocaleDateString() : '';
    const end = range.to ? range.to?.toLocaleDateString() : '';
    start ? setInput(`${start} - ${end}`) : setInput('');
  };

  const isSelectingFirstDay = (dateRange: RangeModifier, day: Date) => {
    const { to, from } = dateRange;
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  };

  const isRangeSelected = React.useMemo(() => {
    const { enteredTo, from } = range;
    return from != null && enteredTo != null && DateUtils.isDayBefore(from, enteredTo);
  }, [range]);

  const resetDateRange = () => setRange(initialRange);

  const onDayClick = (newDate: Date) => {
    const { from, to } = range;

    if (from && to && newDate >= from && newDate <= to) {
      resetDateRange();
      return;
    }

    if (isSelectingFirstDay(range, newDate)) {
      setRange({
        from: newDate,
        to: undefined,
        enteredTo: undefined,
      });
    } else {
      setRange({
        from: range.from,
        to: newDate,
        enteredTo: newDate,
      });
    }

    variablesInputRef.current?.blur();
  };

  const onDayMouseEnter = (newDate: Date) => {
    if (!isSelectingFirstDay(range, newDate)) {
      setRange({ from: range.from, to: range.to, enteredTo: newDate });
    }
  };

  const handleClear = () => {
    setInput('');
    resetDateRange();
  };

  const setTimeRange = (timeRange: TimeRange | string) => {
    if (timeRange === TimeRange.CUSTOM) {
      setRangeInput(range);
    } else {
      setInput(timeRange);
    }
  };

  const handleApplyClick = () => {
    if (!range.from || !range.to) return;
    setTimeRange(TimeRange.CUSTOM);
    onHideCalendar();
  };

  React.useEffect(() => {
    onChange(input);
  }, [input]);

  return (
    <Popper
      placement={placement}
      renderContent={() =>
        calendarOpened && (
          <PopperContent>
            <DayPickerContainer>
              <TimeRangePicker
                isConversation
                className="DayPicker"
                modifiers={modifiers}
                initialMonth={initialMonth}
                selectedDays={selectedDays}
                disabledDays={disabledDays}
                weekdaysShort={WEEKDAYS}
                onDayClick={(date) => onDayClick(date)}
                onDayMouseEnter={(date) => onDayMouseEnter(date)}
                numberOfMonths={2}
                showOutsideDays
                isRangeSelected={isRangeSelected}
              />
              <CalendarFooter>
                <ClearRangeLink onClick={handleClear}>
                  <b>Clear</b>
                </ClearRangeLink>
                <ApplyButton id="apply-date-button" variant={ButtonVariant.PRIMARY} onClick={handleApplyClick}>
                  Apply
                </ApplyButton>
              </CalendarFooter>
            </DayPickerContainer>
          </PopperContent>
        )
      }
    >
      {({ ref, onToggle }) => (
        <div onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(!isOpen)} ref={ref}>
          <TimeRangeSelect
            selfDismiss={true}
            open={isOpen}
            isTranscript
            options={TIME_RANGE_OPTIONS}
            autoWidth
            buttonDisabled={false}
            placeholder="Time Range"
            onSelect={(timeRange: TimeRange) => setTimeRange(timeRange)}
            buttonLabel="Custom period"
            buttonClick={() => {
              onToggle();
              onShowCalendar();
            }}
            selectedValue={input}
            selectedItems={input}
            dropdownActive
            withCaret
          />
        </div>
      )}
    </Popper>
  );
};

export default DatePicker;
