import { RecurrenceFreq } from '@voiceflow/alexa-types/build/nodes/reminder';
import { ButtonContainer, Flex } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs';

const DayButton = styled(ButtonContainer)`
  width: 40px;
  height: 40px;

  ${(props) =>
    props.selected
      ? css`
          color: #ffffff;
          background: #5d9df5 !important;
        `
      : css`
          color: #62778c;
        `}

  &:hover {
    background: #eef4f6 !important;
  }
`;

const WeeklyContainer = styled.div`
  margin-top: 10px;
`;

const weekArray = [
  { text: 'S', val: 'SU' },
  { text: 'M', val: 'MO' },
  { text: 'T', val: 'TU' },
  { text: 'W', val: 'WE' },
  { text: 'T', val: 'TH' },
  { text: 'F', val: 'FR' },
  { text: 'S', val: 'SA' },
];

function WeeklySelection({ recurrence, onChange }) {
  const setRecurrenceDay = React.useCallback(
    (val) =>
      onChange({
        recurrence: {
          freq: recurrence.freq,
          byDay: val,
        },
      }),
    [recurrence.freq, onChange]
  );

  return (
    <WeeklyContainer>
      {recurrence.freq === RecurrenceFreq.WEEKLY && (
        <Flex>
          {weekArray.map((day, index) => (
            <DayButton
              key={index}
              selected={recurrence.byDay === day.val}
              onClick={() => setRecurrenceDay(day.val)}
              disabled={recurrence.byDay === day.val}
            >
              {day.text}
            </DayButton>
          ))}
        </Flex>
      )}
    </WeeklyContainer>
  );
}

export default WeeklySelection;
