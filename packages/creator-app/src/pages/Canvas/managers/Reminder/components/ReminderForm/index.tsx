import { AlexaNode } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import DayPickerInput from '@/components/DayPickerInput';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';

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
import { RECURRENCE_OPTIONS } from './constants';

const USER_TIMEZONE = 'User Timezone';
const TIMEZONE_OPTIONS = [USER_TIMEZONE, ...Utils.timezones.TIMEZONES];

export interface ReminderFormProps {
  data: Realtime.NodeData.Reminder & { voice?: string };
  onChange: (data: Partial<Realtime.NodeData.Reminder>) => void;
  withDate?: boolean;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ data, withDate, onChange }) => {
  const { text, voice, recurrence, recurrenceBool, reminderType, date, hours, minutes, seconds, timezone } = data;

  const updateTime =
    <T extends keyof Realtime.NodeData.Reminder>(key: T) =>
    ({ text }: { text: string }) =>
      onChange({ [key]: text });

  const updateDate = React.useCallback((date: string | Date) => onChange({ date: date instanceof Date ? date.toJSON() : date }), [onChange]);
  const updateTimezone = React.useCallback((timezone?: string) => onChange({ timezone }), [onChange]);

  const updateRecurrenceType = React.useCallback(
    (freq: AlexaNode.Reminder.RecurrenceFreq) =>
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
            freq: AlexaNode.Reminder.RecurrenceFreq.DAILY,
          },
        }),
      }),
    [recurrence, recurrenceBool, onChange]
  );

  React.useEffect(() => {
    if (recurrenceBool && !recurrence?.freq) {
      updateRecurrenceType(AlexaNode.Reminder.RecurrenceFreq.DAILY);
    }
  }, [recurrenceBool]);

  return (
    <>
      <Section isDividerNested>
        <FormControl
          label={
            <>
              {reminderType === 'timer' ? 'Time From Now' : 'Time'}
              <TutorialInfoIcon>{'In 24-hour format. Use "{" to add variables'}</TutorialInfoIcon>
            </>
          }
        />

        {withDate && (
          <TimeZoneContainer>
            <TimeLabel>DATE</TimeLabel>
            <TimeLabel>TIMEZONE</TimeLabel>
            <TimeLabel className="pr-1">
              <DayPickerInput date={date} onChange={updateDate} />
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
              {recurrence.freq === AlexaNode.Reminder.RecurrenceFreq.WEEKLY && <WeeklySelection recurrence={recurrence} onChange={onChange} />}
            </RecurrenceContainer>
          )}
        </UncontrolledSection>
      )}
    </>
  );
};

export default ReminderForm;
