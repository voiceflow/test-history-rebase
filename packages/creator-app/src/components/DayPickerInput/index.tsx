import { Portal, usePopper } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useEnableDisable } from '@/hooks';

import { DayPickerContainer, FORMAT, TimeRangePicker, WEEKDAYS } from './components';

const VariablesInputComponent = VariablesInput as React.FC<any>;

export interface DayPickerInputProps {
  date?: string | Date;
  onChange: (date: string | Date) => void;
}

const DayPickerInput = ({ date, onChange }: DayPickerInputProps) => {
  const popper = usePopper({
    placement: 'bottom-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });

  const variablesInputRef = React.useRef<{ blur: Function; getEditorState: Function } | null>(null);
  const [isShown, onShow, onHide] = useEnableDisable(false);
  const currentDate = React.useMemo(() => new Date(), []);

  const [selectedDay, formattedDate] = React.useMemo(() => {
    const ddate = dayjs(date);
    const isValid = !!date && ddate.isValid();

    return [isValid ? ddate.toDate() : undefined, isValid ? ddate.format(FORMAT) : (date && `${date}`) || ''];
  }, [date]);

  const onBlur = React.useCallback(
    ({ text }: { text: string }) => {
      const ddate = dayjs(text);

      if (ddate.isValid()) {
        onChange(ddate.toDate());
      } else {
        onChange(text);
      }
    },
    [onChange]
  );

  const onDayClick = React.useCallback(
    (newDate: Date) => {
      onChange(newDate);
      onHide();
      variablesInputRef.current?.blur();
    },
    [onChange]
  );

  React.useEffect(() => {
    // eslint-disable-next-line xss/no-mixed-html
    const clickHandler = (e: MouseEvent) => {
      const isEditorFocused = variablesInputRef.current?.getEditorState().getSelection().hasFocus;

      // eslint-disable-next-line xss/no-mixed-html
      if (isEditorFocused || (e.currentTarget && popper.popperElement?.contains(e.target as HTMLElement))) {
        return;
      }

      onHide();
    };

    if (isShown) {
      window.document.body.addEventListener('click', clickHandler, true);
    }

    return () => {
      window.document.body.removeEventListener('click', clickHandler, true);
    };
  }, [isShown]);

  return (
    <>
      <div ref={popper.setReferenceElement} onClick={onShow}>
        <VariablesInputComponent
          ref={(editor: any) => {
            variablesInputRef.current = editor;
          }}
          value={formattedDate}
          onBlur={onBlur}
          onFocus={onShow}
          placeholder={FORMAT}
        />
      </div>

      {isShown && (
        <Portal>
          <DayPickerContainer ref={popper.setPopperElement} style={{ ...popper.styles.popper }} {...popper.attributes.popper}>
            <TimeRangePicker
              weekdaysShort={WEEKDAYS}
              initialMonth={selectedDay}
              selectedDays={selectedDay}
              disabledDays={{ before: currentDate }}
              onDayClick={onDayClick}
            />
          </DayPickerContainer>
        </Portal>
      )}
    </>
  );
};

export default DayPickerInput;
