import { Utils } from '@voiceflow/common';
import { Popper } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';

import { DayPickerContainer, FORMAT, TimeRangePicker } from './components';

export interface DayPickerInputProps {
  date?: string | Date;
  onChange: (date: string | Date) => void;
}

const DayPickerInput: React.FC<DayPickerInputProps> = ({ date, onChange }) => {
  const currentDate = React.useMemo(() => new Date(), []);

  const [selectedDay, formattedDate] = React.useMemo(() => {
    const ddate = dayjs(date);
    const isValid = !!date && ddate.isValid();

    return [isValid ? ddate.toDate() : undefined, isValid ? ddate.format(FORMAT) : (date && `${date}`) || ''];
  }, [date]);

  const onBlur = ({ text }: { text: string }) => {
    const ddate = dayjs(text);

    if (ddate.isValid()) {
      onChange(ddate.toDate());
    } else {
      onChange(text);
    }
  };

  const onDayClick = (newDate: Date) => onChange(newDate);

  return (
    <Popper
      renderContent={({ onToggle }) => (
        <DayPickerContainer>
          <TimeRangePicker
            selected={selectedDay}
            disabled={{ before: currentDate }}
            onDayClick={Utils.functional.chain(onDayClick, onToggle)}
            defaultMonth={selectedDay}
          />
        </DayPickerContainer>
      )}
    >
      {({ ref, onToggle }) => (
        <div ref={ref} onClick={onToggle}>
          <VariablesInput value={formattedDate} onBlur={onBlur} placeholder={FORMAT} />
        </div>
      )}
    </Popper>
  );
};

export default DayPickerInput;
