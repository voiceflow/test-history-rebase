import { Utils } from '@voiceflow/common';
import { TimeRange } from '@voiceflow/internal';
import { ButtonVariant, Popper, PopperProps, useCreateConst } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';
import { DateUtils, RangeModifier } from 'react-day-picker';

import { TimeRangePicker, WEEKDAYS } from '@/components/DayPickerInput/components';
import DropdownMultiselect from '@/components/DropdownMultiselect';
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
  onChange: (input: TimeRange | string) => void;
  placement?: PopperProps['placement'];
  currentRange: string;
}

const DatePicker: React.FC<DayPickerInputProps> = ({ onChange, placement, currentRange }) => {
  const variablesInputRef = React.useRef<{ blur: Function; getEditorState: Function } | null>(null);
  const [calendarOpened, onShowCalendar, onHideCalendar] = useEnableDisable(false);

  const getDefaultRange = (): RangeModifier & { enteredTo?: Date | null } => {
    if (!currentRange || isBuiltInRange(currentRange)) return initialRange;

    const date = currentRange.split('-');
    const to = dayjs(date[1]);
    const from = dayjs(date[0]);

    if (!from.isValid() || !to.isValid()) return initialRange;

    return { from: from.toDate(), to: to.toDate(), enteredTo: to.toDate() };
  };

  const currentMonth = useCreateConst(() => new Date());

  const [range, setRange] = React.useState(() => getDefaultRange());
  const [input, setInput] = React.useState<TimeRange | string>(currentRange);
  const [isOpen, setIsOpen] = React.useState(false);

  const onChangeInput = (input: TimeRange | string) => {
    setInput(input);
    onChange(input);
  };

  const setRangeInput = (range: RangeModifier) => {
    const end = range.to ? range.to?.toLocaleDateString() : '';
    const start = range.from ? range.from?.toLocaleDateString() : '';

    onChangeInput(start ? `${start} - ${end}` : '');
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
      setRange({ to: undefined, from: newDate, enteredTo: undefined });
    } else {
      setRange({ to: newDate, from: range.from, enteredTo: newDate });
    }

    variablesInputRef.current?.blur();
  };

  const onDayMouseEnter = (newDate: Date) => {
    if (!isSelectingFirstDay(range, newDate)) {
      setRange({ from: range.from, to: range.to, enteredTo: newDate });
    }
  };

  const handleClear = () => {
    onChangeInput('');
    resetDateRange();
  };

  const setTimeRange = (timeRange: TimeRange | string) => {
    if (timeRange === TimeRange.CUSTOM) {
      setRangeInput(range);
    } else {
      onChangeInput(timeRange);
    }
  };

  const handleApplyClick = () => {
    if (!range.from || !range.to) return;
    setTimeRange(TimeRange.CUSTOM);
    onHideCalendar();
  };

  return (
    <Popper
      placement={placement}
      renderContent={() =>
        calendarOpened && (
          <Popper.Content>
            <DayPickerContainer>
              <TimeRangePicker
                modifiers={{
                  end: range.enteredTo ?? undefined,
                  start: range.from ?? undefined,
                  sundays: { daysOfWeek: [0] },
                  saturdays: { daysOfWeek: [6] },
                }}
                className="DayPicker"
                onDayClick={onDayClick}
                initialMonth={range.from || currentMonth}
                selectedDays={range.from ? [range.from, { from: range.from, to: range.enteredTo }] : undefined}
                disabledDays={range.from ? { before: range.from } : undefined}
                weekdaysShort={WEEKDAYS}
                isConversation
                numberOfMonths={2}
                showOutsideDays
                onDayMouseEnter={onDayMouseEnter}
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
          </Popper.Content>
        )
      }
    >
      {({ ref, onToggle }) => (
        <div onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(!isOpen)} ref={ref}>
          <TimeRangeSelect
            open={isOpen}
            options={TIME_RANGE_OPTIONS}
            onSelect={(timeRange: TimeRange) => setTimeRange(timeRange)}
            withCaret
            autoWidth
            selfDismiss
            buttonClick={Utils.functional.chain(onToggle, onShowCalendar)}
            placeholder="Time Range"
            buttonLabel="Custom period"
            isTranscript
            selectedValue={input}
            selectedItems={input}
            dropdownActive
            buttonDisabled={false}
          />
        </div>
      )}
    </Popper>
  );
};

export default DatePicker;
