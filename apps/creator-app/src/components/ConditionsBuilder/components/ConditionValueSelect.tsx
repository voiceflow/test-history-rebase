import { BaseNode } from '@voiceflow/base-types';
import { Badge, Box, swallowEvent, useDebouncedCallback } from '@voiceflow/ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import type { VariablesInputRef } from '@/components/VariablesInput';
import VariablesInput from '@/components/VariablesInput';
import { useEnableDisable } from '@/hooks';

import { isValidExpressionValue, isVariable } from '../utils';

export interface ConditionValueSelectProps {
  value?: string;
  onChange: (data: {
    value: string;
    type: BaseNode.Utils.ExpressionTypeV2.VARIABLE | BaseNode.Utils.ExpressionTypeV2.VALUE;
  }) => void;
  onClose?: () => void;
}

const ConditionValueSelect: React.FC<ConditionValueSelectProps> = ({ value = '', onChange, onClose }) => {
  const inputRef = React.useRef<VariablesInputRef>(null);
  const [error, setError, resetError] = useEnableDisable(false);
  const [show, onShow, onHide] = useEnableDisable(false);
  const [empty, updateIsEmpty] = React.useState(true);

  const debouncedSetError = useDebouncedCallback(100, setError);

  /**
   * using focus() on draftjs breaks the mention plugin,
   * this offers a temporary fix until library itself offers a build-in solution
   * https://github.com/draft-js-plugins/draft-js-plugins/issues/800
   */

  const onUpdate = React.useCallback(
    (value: string) => {
      if (isEmpty(value)) {
        debouncedSetError();
        return;
      }

      if (!isValidExpressionValue(value)) {
        setError();
        return;
      }

      onChange({
        value,
        type: isVariable(value) ? BaseNode.Utils.ExpressionTypeV2.VARIABLE : BaseNode.Utils.ExpressionTypeV2.VALUE,
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
      <VariablesInput
        ref={inputRef}
        value={value}
        error={error}
        onFocus={onShow}
        onBlur={onSave}
        onEmpty={updateIsEmpty}
        fullWidth
        placeholder="Enter value or {variable}"
        onEnterPress={onEnter}
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
        <Box fontSize={13} color="#BD425F" mt={16}>
          {isEmpty(value)
            ? 'This is a required input'
            : 'Input can only contain values or a variable, not both. No empty values.'}
        </Box>
      )}
    </>
  );
};

export default ConditionValueSelect;
