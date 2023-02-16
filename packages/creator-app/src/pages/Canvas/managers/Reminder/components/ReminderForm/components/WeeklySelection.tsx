import { AlexaNode } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Flex } from '@voiceflow/ui';
import React from 'react';

import DayButton from './DayButton';

const WEEKS = [
  { text: 'S', val: 'SU' },
  { text: 'M', val: 'MO' },
  { text: 'T', val: 'TU' },
  { text: 'W', val: 'WE' },
  { text: 'T', val: 'TH' },
  { text: 'F', val: 'FR' },
  { text: 'S', val: 'SA' },
];

interface WeeklySelectionProps {
  onChange: (data: Partial<Realtime.NodeData.Reminder>) => void;
  recurrence: Realtime.NodeData.ReminderRecurrence;
}

const WeeklySelection: React.FC<WeeklySelectionProps> = ({ recurrence, onChange }) => (
  <Box mt={10}>
    {recurrence.freq === AlexaNode.Reminder.RecurrenceFreq.WEEKLY && (
      <Flex>
        {WEEKS.map((day, index) => (
          <DayButton
            key={index}
            onClick={() => onChange({ recurrence: { freq: recurrence.freq, byDay: day.val } })}
            selected={recurrence.byDay === day.val}
            disabled={recurrence.byDay === day.val}
          >
            {day.text}
          </DayButton>
        ))}
      </Flex>
    )}
  </Box>
);

export default WeeklySelection;
