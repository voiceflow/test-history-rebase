import { Input, Portal, useEnableDisable } from '@voiceflow/ui';
import moment, * as Moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import { Manager, Popper, Reference } from 'react-popper';

import DayPickerContainer from './Container';

const FORMAT = 'DD/MM/YYYY';

const InputComponent = Input as React.FC<any>;

export type DayPickerInputProps = {
  date?: string | Date;
  onChange: (date: string | Date) => void;
  addOffSet?: number;
  addOffSetBy?: Moment.unitOfTime.Base;
  substactOffSet?: number;
  substactOffSetBy?: Moment.unitOfTime.Base;
};

const DayPickerInput = ({ date, onChange, addOffSet, addOffSetBy, substactOffSet, substactOffSetBy }: DayPickerInputProps) => {
  const dayPickerRef = React.useRef<HTMLElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const inputRef = React.useRef<{ blur: Function; getEditorState: Function } | null>(null);

  const [error, setError, clearError] = useEnableDisable(false);
  const [isShown, onShow, onHide] = useEnableDisable(false);

  const currentDate = React.useMemo(() => new Date(), []);

  const [selectedDay, formattedDate] = React.useMemo(() => {
    const mdate = moment(date);
    const isValid = !!date && mdate.isValid();

    return [isValid ? mdate.toDate() : undefined, isValid ? mdate.format(FORMAT) : (date && `${date}`) || ''];
  }, [date]);

  const onDayClick = React.useCallback(
    (newDate: Date) => {
      let dateWithOffset = newDate;

      if (addOffSet) {
        dateWithOffset = moment(newDate).add(addOffSetBy!, addOffSet!).toDate();
      }

      if (substactOffSet) {
        dateWithOffset = moment(newDate).subtract(substactOffSetBy!, substactOffSet!).toDate();
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
      const mdate = moment(value);

      if (mdate.isValid()) {
        onChange(mdate.toDate());
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
    <Manager>
      <Reference>
        {({ ref }) => (
          <div ref={ref} onClick={onShow}>
            <InputComponent
              // eslint-disable-next-line @typescript-eslint/ban-types
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
        )}
      </Reference>

      {isShown && (
        <Portal>
          <Popper
            innerRef={(node) => {
              dayPickerRef.current = node;
            }}
            placement="bottom-start"
            modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
          >
            {({ ref, style, placement }) => (
              <DayPickerContainer ref={ref} style={{ ...style, zIndex: 1100 }} data-placement={placement}>
                <DayPicker initialMonth={selectedDay} selectedDays={selectedDay} disabledDays={{ before: currentDate }} onDayClick={onDayClick} />
              </DayPickerContainer>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default DayPickerInput;
