import { Utils } from '@voiceflow/common';
import { Popper } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';

import { DayPickerContainer, FORMAT, TimeRangePicker, WEEKDAYS } from './components';

const VariablesInputComponent = VariablesInput as React.FC<any>;

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
            onDayClick={Utils.functional.chain(onDayClick, onToggle)}
            initialMonth={selectedDay}
            selectedDays={selectedDay}
            disabledDays={{ before: currentDate }}
            weekdaysShort={WEEKDAYS}
          />
        </DayPickerContainer>
      )}
    >
      {({ ref, onToggle }) => (
        <div ref={ref} onClick={onToggle}>
          <VariablesInputComponent value={formattedDate} onBlur={onBlur} placeholder={FORMAT} />
        </div>
      )}
    </Popper>
  );
};

export default DayPickerInput;
