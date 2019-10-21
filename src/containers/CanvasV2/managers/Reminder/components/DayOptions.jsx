import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

import { styled } from '@/hocs';

const DayButton = styled(Button)`
  text-decoration: ${(props) => (props.selected ? 'underline' : 'none')};
  box-shadow: none !important;
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

const RECURRENCE_TYPE = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
};

function DayOptions({ data, onChange }) {
  const setRecurrenceDay = (val) => {
    onChange({
      recurrence: {
        freq: data.recurrence.freq,
        byDay: val,
      },
    });
  };

  const { recurrence } = data;

  return (
    <div className="mt-3">
      {recurrence.freq === RECURRENCE_TYPE.WEEKLY && (
        <ButtonGroup className="toggle-group mb-2 w-100">
          {weekArray.map((day, index) => {
            return (
              <DayButton
                key={index}
                outline={false}
                selected={recurrence.byDay === day.val}
                onClick={() => setRecurrenceDay(day.val)}
                disabled={recurrence.byDay === day.val}
              >
                {day.text}
              </DayButton>
            );
          })}
        </ButtonGroup>
      )}
    </div>
  );
}

export default DayOptions;
