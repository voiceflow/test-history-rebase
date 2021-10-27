import { Node } from '@voiceflow/alexa-types';
import { Box, Flex } from '@voiceflow/ui';
import React from 'react';

import { NodeData } from '@/models';

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
  onChange: (data: Partial<NodeData.Reminder>) => void;
  recurrence: NodeData.ReminderRecurrence;
}

const WeeklySelection: React.FC<WeeklySelectionProps> = ({ recurrence, onChange }) => (
  <Box mt={10}>
    {recurrence.freq === Node.Reminder.RecurrenceFreq.WEEKLY && (
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
