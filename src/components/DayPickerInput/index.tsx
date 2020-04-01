import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import { Manager, Popper, Reference } from 'react-popper';

import Portal from '@/components/Portal';
import VariablesInput from '@/components/VariablesInput';
import { useEnableDisable } from '@/hooks';

import { DayPickerContainer } from './components';

const FORMAT = 'MM/DD/YYYY';

export type DayPickerInputProps = {
  date?: string | Date;
  onChange: (date: string | Date) => void;
};

const DayPickerInput = ({ date, onChange }: DayPickerInputProps) => {
  const dayPickerRef = React.useRef<HTMLDivElement>(null);
  const variablesInputRef = React.useRef<{ blur: Function; getEditorState: Function }>(null);

  const [isShown, onShow, onHide] = useEnableDisable(false);

  const currentDate = React.useMemo(() => new Date(), []);

  const [selectedDay, formattedDate] = React.useMemo(() => {
    const mdate = moment(date);
    const isValid = !!date && mdate.isValid();

    return [isValid ? mdate.toDate() : undefined, isValid ? mdate.format(FORMAT) : (date && `${date}`) || ''];
  }, [date]);

  const onBlur = React.useCallback(
    ({ text }: { text: string }) => {
      const mdate = moment(text);

      if (mdate.isValid()) {
        onChange(mdate.toDate());
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
          <div ref={ref as any} onClick={onShow}>
            <VariablesInput
              ref={(editor) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
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
