import { ExpressionTypeV2 } from '@voiceflow/general-types';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import Badge from '@/components/Badge';
import Box from '@/components/Box';
import VariablesInput from '@/components/VariablesInput';
import { useEnableDisable } from '@/hooks';
import { swallowEvent } from '@/utils/dom';

import { isValidExpressionValue, isVariable } from '../utils';

const AnyVariablesInput: any = VariablesInput;

export type ConditionValueSelectProps = {
  value?: string;
  onChange: (data: { value: string; type: ExpressionTypeV2.VARIABLE | ExpressionTypeV2.VALUE }) => void;
};

const ConditionValueSelect: React.FC<ConditionValueSelectProps> = ({ value = '', onChange }) => {
  const inputRef = React.useRef<{ blur: () => {}; getCurrentValue: () => { text: string } }>(null);
  const [error, setError, resetError] = useEnableDisable(false);
  const [show, onShow, onHide] = useEnableDisable(false);
  const [empty, updateIsEmpty] = React.useState(true);

  const onUpdate = React.useCallback(
    (value: string) => {
      if (isEmpty(value)) {
        setError();
        return;
      }

      if (!isValidExpressionValue(value)) {
        setError();
        return;
      }

      onChange({
        value,
        type: isVariable(value) ? ExpressionTypeV2.VARIABLE : ExpressionTypeV2.VALUE,
      });

      resetError();
      onHide();
    },
    [onChange]
  );

  const onSave = ({ text }: { text: string }) => onUpdate(text.trim());

  const onEnter = ({ text }: { text: string }) => {
    onUpdate(text.trim());
    inputRef?.current?.blur();
  };

  return (
    <>
      <AnyVariablesInput
        fullWidth
        ref={inputRef}
        value={value}
        error={error}
        onFocus={onShow}
        onBlur={onSave}
        onEmpty={updateIsEmpty}
        onEnterPress={onEnter}
        placeholder="Enter value or {variable}"
        rightAction={
          !empty &&
          show && (
            <Badge slide onClick={swallowEvent(() => onEnter(inputRef.current!.getCurrentValue()))}>
              Enter
            </Badge>
          )
        }
      />
      {error && (
        <Box fontSize={13} color="#e91e63" mt={16}>
          Input can only contain values or a variable, not both. No empty values.
        </Box>
      )}
    </>
  );
};

export default ConditionValueSelect;
