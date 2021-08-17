import { Node } from '@voiceflow/base-types';
import { Badge, Box, swallowEvent } from '@voiceflow/ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { VariableInputRef } from '@/components/VariablesInput/types';
import { useEnableDisable } from '@/hooks';

import { isValidExpressionValue, isVariable } from '../utils';

const AnyVariablesInput: any = VariablesInput;

export interface ConditionValueSelectProps {
  value?: string;
  onChange: (data: { value: string; type: Node.Utils.ExpressionTypeV2.VARIABLE | Node.Utils.ExpressionTypeV2.VALUE }) => void;
  onClose?: () => void;
}

const ConditionValueSelect: React.FC<ConditionValueSelectProps> = ({ value = '', onChange, onClose }) => {
  const inputRef = React.useRef<VariableInputRef>(null);
  const [error, setError, resetError] = useEnableDisable(false);
  const [show, onShow, onHide] = useEnableDisable(false);
  const [empty, updateIsEmpty] = React.useState(true);

  /**
   * using focus() on draftjs breaks the mention plugin,
   * this offers a temporary fix until library itself offers a build-in solution
   * https://github.com/draft-js-plugins/draft-js-plugins/issues/800
   */

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
        type: isVariable(value) ? Node.Utils.ExpressionTypeV2.VARIABLE : Node.Utils.ExpressionTypeV2.VALUE,
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
    onClose?.();
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
        skipBlurOnUnmount
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
          {isEmpty(value) ? 'This is required input' : 'Input can only contain values or a variable, not both. No empty values.'}
        </Box>
      )}
    </>
  );
};

export default ConditionValueSelect;
