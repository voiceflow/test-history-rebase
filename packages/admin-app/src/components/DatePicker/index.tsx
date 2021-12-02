import { Input, Portal, useEnableDisable, usePopper } from '@voiceflow/ui';
import dayjs, * as Dayjs from 'dayjs';
import React from 'react';
import DayPicker from 'react-day-picker';

import DayPickerContainer from './Container';

const FORMAT = 'DD/MM/YYYY';

const InputComponent = Input as React.FC<any>;

export interface DayPickerInputProps {
  date?: string | Date;
  onChange: (date: string | Date) => void;
  addOffSet?: number;
  addOffSetBy?: Dayjs.OpUnitType;
  substactOffSet?: number;
  substactOffSetBy?: Dayjs.OpUnitType;
}

const DayPickerInput = ({ date, onChange, addOffSet, addOffSetBy, substactOffSet, substactOffSetBy }: DayPickerInputProps) => {
  const popper = usePopper({
    placement: 'bottom-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });

  const dayPickerRef = React.useRef<HTMLElement | null>(null);
  const inputRef = React.useRef<{ blur: Function; getEditorState: Function } | null>(null);

  const [error, setError, clearError] = useEnableDisable(false);
  const [isShown, onShow, onHide] = useEnableDisable(false);

  const currentDate = React.useMemo(() => new Date(), []);

  const [selectedDay, formattedDate] = React.useMemo(() => {
    const ddate = dayjs(date);
    const isValid = !!date && ddate.isValid();

    return [isValid ? ddate.toDate() : undefined, isValid ? ddate.format(FORMAT) : (date && `${date}`) || ''];
  }, [date]);

  const onDayClick = React.useCallback(
    (newDate: Date) => {
      let dateWithOffset = newDate;

      if (addOffSet) {
        dateWithOffset = dayjs(newDate).add(addOffSet!, addOffSetBy).toDate();
      }

      if (substactOffSet) {
        dateWithOffset = dayjs(newDate).subtract(substactOffSet!, substactOffSetBy!).toDate();
      }

      onChange(dateWithOffset);
      onHide();
      inputRef.current?.blur();
    },
    [onChange]
  );

  const onInputChange = React.useCallback(({ target: { value = '' } }: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value);

    if (value?.length < 10) {
      setError();

      if (value?.length <= 1) {
        clearError();
        onChange('');
      }
    } else {
      const ddate = dayjs(value);

      if (ddate.isValid()) {
        onChange(ddate.toDate());
        clearError();
      }
    }
  }, []);

  React.useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const isEditorFocused = inputRef.current?.getEditorState?.().getSelection().hasFocus;

      // eslint-disable-next-line xss/no-mixed-html
      if (isEditorFocused || (e.currentTarget && dayPickerRef.current?.contains(e.target as HTMLElement))) {
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
        <InputComponent
          ref={(editor: { blur: Function; getEditorState: Function }) => {
            inputRef.current = editor;
          }}
          value={formattedDate}
          onBlur={onInputChange}
          onFocus={onShow}
          onChange={onInputChange}
          placeholder={FORMAT}
          error={error}
        />
      </div>

      {isShown && (
        <Portal>
          <DayPickerContainer ref={popper.setPopperElement} style={{ ...popper.styles.popper, zIndex: 1100 }} {...popper.attributes.popper}>
            <DayPicker initialMonth={selectedDay} selectedDays={selectedDay} disabledDays={{ before: currentDate }} onDayClick={onDayClick} />
          </DayPickerContainer>
        </Portal>
      )}
    </>
  );
};

export default DayPickerInput;
