import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import { Tooltip } from 'react-tippy';

import { TIMEZONES } from '@/assets/timezones';
import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import VariableInput from '@/components/VariableInput';
import { FlexApart } from '@/componentsV2/Flex';
import { styled } from '@/hocs';

import DayOptions from './DayOptions';
import { RecurrenceToggle } from './ReminderStyle';

const RECURRENCE_TYPE = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
};

const LabelContainer = styled.div`
  display: flex;
`;

const RECURRENCE_ROUTE = [
  {
    label: 'Daily',
    value: RECURRENCE_TYPE.DAILY,
    component: () => <div></div>,
  },
  {
    label: 'Weekly',
    value: RECURRENCE_TYPE.WEEKLY,
    component: DayOptions,
  },
];

const FORMAT = 'DD/MM/YYYY';
const USER_TIMEZONE = 'User Timezone';
const DEFAULT_TIMEZONE = { label: USER_TIMEZONE, value: USER_TIMEZONE };
const TIMEZONE_OPTIONS = [DEFAULT_TIMEZONE, ...TIMEZONES.map((zone) => ({ label: zone.value, value: zone.value }))];

function ReminderForm({ data, withDate, onChange }) {
  const { recurrence, recurrenceBool } = data;

  const updateTime = React.useCallback((key) => (value) => onChange({ [key]: value }), [onChange]);
  const updateDate = React.useCallback((date) => onChange({ date }), [onChange]);
  const updateTimezone = React.useCallback((timezone) => onChange({ timezone }), [onChange]);

  const updateRecurrenceType = React.useCallback(
    (val) =>
      onChange({
        recurrence: {
          freq: val,
          byDay: recurrence.byDay,
        },
      }),
    [recurrence.byDay, onChange]
  );

  const updateRecurrenceBool = React.useCallback(() => onChange({ recurrenceBool: !recurrenceBool }), [recurrenceBool, onChange]);

  const changeDate = React.useCallback(
    (day, modifiers, dayPickerInput) => {
      if (day) {
        updateDate(new Date(day));
      } else {
        setTimeout(() => updateDate(dayPickerInput.state.value), 0);
      }
    },
    [updateDate]
  );

  return (
    <>
      <LabelContainer>
        {data.reminderType === 'timer' ? (
          <label>Time From Now</label>
        ) : (
          <>
            <label>Time</label>{' '}
            <Tooltip className="ml-1 mt-1" theme="menu" position="top" title="In 24-hour format">
              <SvgIcon color="#BECEDC" hoverColor="#6e849a" icon="info" size={15} />
            </Tooltip>
          </>
        )}
      </LabelContainer>
      <div className="grid-col-3 text-muted mb-2">
        <div>Hours</div>
        <div className="px-1">Minutes</div>
        <div>Seconds</div>
        <div>
          <VariableInput className="form-control" placeholder="24" value={data.hours} onChange={updateTime('hours')} />
        </div>
        <div className="px-1">
          <VariableInput className="form-control" placeholder="60" value={data.minutes} onChange={updateTime('minutes')} />
        </div>
        <div>
          <VariableInput className="form-control" placeholder="60" value={data.seconds} onChange={updateTime('seconds')} />
        </div>
      </div>
      {withDate && (
        <>
          <div className="grid-col-2-skew grid-col-2 text-muted mb-2">
            <div>Date</div>
            <div>Timezone</div>
            <div className="pr-1">
              <DayPickerInput
                formatDate={formatDate}
                format={FORMAT}
                parseDate={parseDate}
                placeholder="DD/MM/YYYY"
                dayPickerProps={{
                  disabledDays: {
                    before: new Date(),
                  },
                }}
                inputProps={{ className: 'form-control' }}
                value={data.date}
                onDayChange={changeDate}
              />
            </div>
            <div>
              <Select
                classNamePrefix="select-box"
                value={data.timezone ? { value: data.timezone, label: data.timezone } : DEFAULT_TIMEZONE}
                onChange={({ value }) => updateTimezone(value)}
                options={TIMEZONE_OPTIONS}
              />
            </div>
          </div>
          <FlexApart>
            <label className="mb-0">Recurrence</label>
            <RecurrenceToggle checked={recurrenceBool} icons={false} onChange={updateRecurrenceBool} />
          </FlexApart>

          {recurrenceBool && (
            <div>
              <ButtonGroupRouter
                selected={data.recurrence.freq}
                routes={RECURRENCE_ROUTE}
                routeProps={{ data, onChange }}
                onChange={updateRecurrenceType}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ReminderForm;
