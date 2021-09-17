import { Portal } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import VariablesInput from '@/components/VariablesInput';
import { useEnableDisable } from '@/hooks';

import { DayPickerContainer, FORMAT, TimeRangePicker, WEEKDAYS } from './components';

const VariablesInputComponent = VariablesInput as React.FC<any>;

export interface DayPickerInputProps {
  date?: string | Date;
  onChange: (date: string | Date) => void;
}

const DayPickerInput = ({ date, onChange }: DayPickerInputProps) => {
  const dayPickerRef = React.useRef<HTMLElement | null>(null);
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
                <TimeRangePicker
                  weekdaysShort={WEEKDAYS}
                  initialMonth={selectedDay}
                  selectedDays={selectedDay}
                  disabledDays={{ before: currentDate }}
                  onDayClick={onDayClick}
                />
              </DayPickerContainer>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default DayPickerInput;
