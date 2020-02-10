import React from 'react';
import { ButtonGroup } from 'reactstrap';

import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';
import { css, styled } from '@/hocs';

import { RecurrenceType } from '../constants';

const DayButton = styled(ButtonContainer)`
  height: 40px;
  width: 40px;

  ${(props) =>
    props.selected
      ? css`
          background: #5d9df5 !important;
          color: #ffffff;
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
      {recurrence.freq === RecurrenceType.WEEKLY && (
        <ButtonGroup>
          {weekArray.map((day, index) => {
            return (
              <DayButton
                key={index}
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
    </WeeklyContainer>
  );
}

export default WeeklySelection;
