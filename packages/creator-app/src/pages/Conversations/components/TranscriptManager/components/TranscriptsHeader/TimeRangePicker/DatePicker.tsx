import moment from 'moment';
import React from 'react';
import { DateUtils, Modifier, RangeModifier } from 'react-day-picker';
import { Manager, Popper, Reference } from 'react-popper';
import { useHistory } from 'react-router-dom';

import { ButtonVariant } from '@/components/Button';
import { FORMAT, TimeRangePicker, WEEKDAYS } from '@/components/DayPickerInput/components';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import Portal from '@/components/Portal';
import { useEnableDisable } from '@/hooks';
import { FILTER_TAG } from '@/pages/Conversations/constants';

import { ApplyButton, CalendarFooter, ClearRangeLink, DayPickerContainer } from './components';

const TimeRangeSelect: any = DropdownMultiselect;

enum TimeRange {
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
  onChange: (date: string | Date) => void;
};

const DatePicker = ({ date, onChange }: DayPickerInputProps) => {
  const dayPickerRef = React.useRef<HTMLElement | null>(null);
  const variablesInputRef = React.useRef<{ blur: Function; getEditorState: Function } | null>(null);
  const history = useHistory();

  const [calenderOpened, onShowCalender, onHideCalender] = useEnableDisable(false);
  const startDate = undefined;
  const endDate = undefined;

  const [input, setInput] = React.useState('' as TimeRange | string);
  const [range, setRange] = React.useState({ from: startDate, to: endDate } as RangeModifier);
  const [isOpen, setIsOpen] = React.useState(false);
  const modifiers: Partial<Modifier> = { start: range.from, end: range.to };

  const [selectedDay] = React.useMemo(() => {
    const mdate = moment(date);
    const isValid = !!date && mdate.isValid();

    return [isValid ? mdate.toDate() : undefined, isValid ? mdate.format(FORMAT) : (date && `${date}`) || ''];
  }, [date]);

  React.useEffect(() => {
    // eslint-disable-next-line xss/no-mixed-html
    const clickHandler = (e: MouseEvent) => {
      const isEditorFocused = variablesInputRef.current?.getEditorState().getSelection().hasFocus;

      // eslint-disable-next-line xss/no-mixed-html
      if (isEditorFocused || (e.currentTarget && dayPickerRef.current?.contains(e.target as HTMLElement))) {
        return;
      }

      onHideCalender();
    };

    if (calenderOpened) {
      window.document.body.addEventListener('click', clickHandler, true);
    }

    return () => {
      window.document.body.removeEventListener('click', clickHandler, true);
    };
  }, [calenderOpened]);

  const setTimeRange = (timeRange: TimeRange | string) => {
    if (timeRange === TimeRange.CUSTOM) {
      onShowCalender();
      setRangeInput(range);
    } else {
      setInput(timeRange);
      handleTimeRangeChange(timeRange);
    }
  };

  const setRangeInput = (range: RangeModifier) => {
    const start = range.from ? range.from?.toLocaleDateString() : '';
    const end = range.to ? range.to?.toLocaleDateString() : '';
    start ? setInput(`${start} - ${end}`) : setInput('');
    handleTimeRangeChange(TimeRange.CUSTOM);
  };

  const onDayClick = (newDate: Date) => {
    onChange(newDate);
    const newRange = DateUtils.addDayToRange(newDate, range);
    setRange({ from: newRange.from, to: newRange.to });
    setRangeInput(newRange);
    variablesInputRef.current?.blur();
  };

  const handleTimeRangeChange = (timeRange?: TimeRange | string) => {
    const params = new URLSearchParams();

    if (timeRange === TimeRange.CUSTOM) {
      params.append(FILTER_TAG.START_DATE, range.from ? range.from.toLocaleString() : '');
      params.append(FILTER_TAG.END_DATE, range.to ? range.to.toLocaleString() : '');
    } else {
      params.append(FILTER_TAG.RANGE, timeRange!);
    }

    history.push({ search: params.toString() });
  };

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(!isOpen)} ref={ref}>
            <TimeRangeSelect
              selfDismiss
              open={isOpen}
              isTranscript
              options={TIME_RANGE_OPTIONS}
              autoWidth
              buttonDisabled={false}
              placeholder="Time Range"
              onSelect={(timeRange: TimeRange) => {
                setTimeRange(timeRange);
              }}
              buttonLabel="Custom period"
              buttonClick={() => {
                setTimeRange(TimeRange.CUSTOM);
              }}
              selectedValue={input}
              selectedItems={input}
              dropdownActive
              withCaret
            />
          </div>
        )}
      </Reference>

      {calenderOpened && (
        <Portal>
          <Popper
            innerRef={(node) => {
              dayPickerRef.current = node;
            }}
            placement="right"
            modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
          >
            {({ ref, style }) => (
              <DayPickerContainer ref={ref} style={{ ...style }} data-placement="bottom-end">
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
                  <ClearRangeLink
                    onClick={() => {
                      setInput('');
                      setRange({ from: undefined, to: undefined });
                    }}
                  >
                    <b>Clear</b>
                  </ClearRangeLink>
                  <ApplyButton id="apply-date-button" variant={ButtonVariant.PRIMARY} onClick={() => onHideCalender()}>
                    Apply
                  </ApplyButton>
                </CalendarFooter>
              </DayPickerContainer>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default DatePicker;
