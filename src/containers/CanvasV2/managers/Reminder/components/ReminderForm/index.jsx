import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

import { TIMEZONES } from '@/assets/timezones';
import RadioGroup from '@/components/RadioGroup';
import InfoIcon from '@/componentsV2/InfoIcon';
import Section, { SectionToggleVariant, UncontrolledSection } from '@/componentsV2/Section';
import VariablesInput from '@/componentsV2/VariablesInput';
import { FormControl } from '@/containers/CanvasV2/components/Editor';

import {
  RecurrenceContainer,
  ReminderContent,
  TimeContainer,
  TimeLabel,
  TimeZoneContainer,
  TimeZoneSelection,
  VariableInputContainer,
  WeeklySelection,
} from './components';
import { RECURRENCE_OPTIONS, RecurrenceType } from './constants';

const FORMAT = 'MM/DD/YYYY';
const USER_TIMEZONE = 'User Timezone';
const TIMEZONE_OPTIONS = [USER_TIMEZONE, ...TIMEZONES];

function ReminderForm({ data, withDate, onChange }) {
  const { text, voice, recurrence, recurrenceBool, reminderType, date, hours, minutes, seconds, timezone } = data;

  const updateTime = React.useCallback((key) => ({ text }) => onChange({ [key]: text }), [onChange]);
  const updateDate = React.useCallback((date) => onChange({ date }), [onChange]);
  const updateTimezone = React.useCallback((timezone) => onChange({ timezone }), [onChange]);

  const updateRecurrenceType = React.useCallback(
    (freq) =>
      onChange({
        recurrence: {
          ...recurrence,
          freq,
        },
      }),
    [recurrence, onChange]
  );

  const toggleRecurrenceBool = React.useCallback(
    () =>
      onChange({
        recurrenceBool: !recurrenceBool,
        ...(!recurrenceBool && {
          recurrence: {
            ...recurrence,
            freq: RecurrenceType.DAILY,
          },
        }),
      }),
    [recurrence, recurrenceBool, onChange]
  );

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

  React.useEffect(() => {
    if (recurrenceBool && !recurrence?.freq) {
      updateRecurrenceType(RecurrenceType.DAILY);
    }
  }, [recurrenceBool]);

  return (
    <>
      <Section isDividerNested>
        <FormControl
          label={
            <>
              {reminderType === 'timer' ? 'Time From Now' : 'Time'}
              <InfoIcon>{'In 24-hour format. Use "{" to add variables'}</InfoIcon>
            </>
          }
        />

        {withDate && (
          <TimeZoneContainer>
            <TimeLabel>DATE</TimeLabel>
            <TimeLabel>TIMEZONE</TimeLabel>
            <TimeLabel className="pr-1">
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
                value={date}
                onDayChange={changeDate}
              />
            </TimeLabel>
            <TimeZoneSelection
              value={timezone || USER_TIMEZONE}
              onSelect={(value) => updateTimezone(value)}
              autoWidth={false}
              searchable
              options={TIMEZONE_OPTIONS}
            />
          </TimeZoneContainer>
        )}

        <TimeContainer>
          <TimeLabel>HOURS</TimeLabel>
          <TimeLabel>MINUTES</TimeLabel>
          <TimeLabel>SECONDS</TimeLabel>
          <VariableInputContainer width={107}>
            <VariablesInput placeholder="24" value={hours} onBlur={updateTime('hours')} />
          </VariableInputContainer>
          <VariableInputContainer width={118}>
            <VariablesInput placeholder="60" value={minutes} onBlur={updateTime('minutes')} />
          </VariableInputContainer>
          <VariableInputContainer width={122}>
            <VariablesInput placeholder="60" value={seconds} onBlur={updateTime('seconds')} />
          </VariableInputContainer>
        </TimeContainer>
      </Section>

      <ReminderContent value={text} voice={voice} onChange={onChange} />

      {withDate && (
        <UncontrolledSection
          isCollapsed={!recurrenceBool}
          header="Recurrence"
          headerToggle
          isDividerNested
          onClick={toggleRecurrenceBool}
          collapseVariant={SectionToggleVariant.TOGGLE}
        >
          {recurrence && (
            <RecurrenceContainer>
              <RadioGroup options={RECURRENCE_OPTIONS} checked={recurrence.freq} name="Recurrence" onChange={updateRecurrenceType} />
              {recurrence.freq === RecurrenceType.WEEKLY && <WeeklySelection recurrence={recurrence} onChange={onChange} />}
            </RecurrenceContainer>
          )}
        </UncontrolledSection>
      )}
    </>
  );
}

export default ReminderForm;
