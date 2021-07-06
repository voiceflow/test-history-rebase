import { ButtonVariant } from '@voiceflow/ui';
import moment from 'moment';
import React from 'react';
import { DateUtils, Modifier, RangeModifier } from 'react-day-picker';

import { FORMAT, TimeRangePicker, WEEKDAYS } from '@/components/DayPickerInput/components';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import Popper, { PopperContent, PopperProps } from '@/components/Popper';
import { useEnableDisable } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';

import { ApplyButton, CalendarFooter, ClearRangeLink, DayPickerContainer } from './components';

const TimeRangeSelect: any = DropdownMultiselect;

export enum TimeRange {
  TODAY = 'Today',
  YESTERDAY = 'Yesterday',
  WEEK = 'Last 7 Days',
  MONTH = 'Last 30 days',
  ALLTIME = 'All time',
  CUSTOM = 'Custom Period',
}

const TIME_RANGE_OPTIONS = [
  { label: 'Today', value: TimeRange.TODAY },
  { label: 'Yesterday', value: TimeRange.YESTERDAY },
  { label: 'Last 7 days', value: TimeRange.WEEK },
  { label: 'Last 30 days', value: TimeRange.MONTH },
  { label: 'All time', value: TimeRange.ALLTIME },
];

export type DayPickerInputProps = {
  date?: string | Date;
  placement?: PopperProps['placement'];
  onChange: (input: TimeRange | string) => void;
};

const DatePicker: React.FC<DayPickerInputProps> = ({ date, placement, onChange }) => {
  const variablesInputRef = React.useRef<{ blur: Function; getEditorState: Function } | null>(null);
  const [calendarOpened, onShowCalendar, onHideCalendar] = useEnableDisable(false);
  const [range, setRange] = React.useState({ from: undefined, to: undefined } as RangeModifier);
  const [isOpen, setIsOpen] = React.useState(false);
  const modifiers: Partial<Modifier> = { start: range.from, end: range.to };

  const defaultParams = () => {
    if (window.location.search.includes(FILTER_TAG.RANGE)) {
      return new URLSearchParams(window.location.search).get(FILTER_TAG.RANGE);
    }
    if (window.location.search.includes(FILTER_TAG.START_DATE) && window.location.search.includes(FILTER_TAG.END_DATE)) {
      return `${new URLSearchParams(window.location.search).get(FILTER_TAG.START_DATE)}- ${new URLSearchParams(window.location.search).get(
        FILTER_TAG.END_DATE
      )}`;
    }
    return '';
  };

  const [input, setInput] = React.useState(defaultParams() as TimeRange | string);

  const [selectedDay] = React.useMemo(() => {
    const mdate = moment(date);
    const isValid = !!date && mdate.isValid();

    return [isValid ? mdate.toDate() : undefined, isValid ? mdate.format(FORMAT) : (date && `${date}`) || ''];
  }, [date]);

  const setRangeInput = (range: RangeModifier) => {
    const start = range.from ? range.from?.toLocaleDateString() : '';
    const end = range.to ? range.to?.toLocaleDateString() : '';
    start ? setInput(`${start} - ${end}`) : setInput('');
  };

  const onDayClick = (newDate: Date) => {
    const newRange = DateUtils.addDayToRange(newDate, range);
    setRange({ from: newRange.from, to: newRange.to });
    variablesInputRef.current?.blur();
  };

  const setTimeRange = (timeRange: TimeRange | string) => {
    if (timeRange === TimeRange.CUSTOM) {
      setRangeInput(range);
    } else {
      setInput(timeRange);
    }
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
                initialMonth={selectedDay}
                selectedDays={range}
                weekdaysShort={WEEKDAYS}
                onDayClick={(date) => onDayClick(date)}
                numberOfMonths={2}
                showOutsideDays
              />
              <CalendarFooter>
                <ClearRangeLink onClick={() => setInput('')}>
                  <b>Clear</b>
                </ClearRangeLink>
                <ApplyButton
                  id="apply-date-button"
                  variant={ButtonVariant.PRIMARY}
                  onClick={() => {
                    setTimeRange(TimeRange.CUSTOM);
                    onHideCalendar();
                  }}
                >
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
