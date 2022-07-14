import { BaseNode } from '@voiceflow/base-types';
import { Badge, Input, swallowEvent } from '@voiceflow/ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import VariablesInput, { VariablesInputRef } from '@/components/VariablesInput';
import { useEnableDisable } from '@/hooks';

import { isValidExpressionValue, isVariable } from '../../../../ConditionsBuilder/utils';
import { VARIABLE_PLACEHOLDER } from '../../../constants';

export interface ConditionValueSelectProps {
  value?: string;
  onChange: (data: { value: string; type: BaseNode.Utils.ExpressionTypeV2.VARIABLE | BaseNode.Utils.ExpressionTypeV2.VALUE }) => void;
  onClose?: () => void;
  onFocus: VoidFunction;
  onBlur: VoidFunction;
}

const ConditionValueSelect: React.FC<ConditionValueSelectProps> = ({ value = '', onChange, onClose, onFocus, onBlur }) => {
  const inputRef = React.useRef<VariablesInputRef>(null);
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
    <VariablesInput
      variant={Input.Variant.INLINE}
      ref={inputRef}
      value={value}
      error={error}
      onFocus={() => {
        onShow();
        onFocus();
      }}
      onBlur={(...args) => {
        onSave(...args);
        onBlur();
      }}
      onEmpty={updateIsEmpty}
      fullWidth
      placeholder={VARIABLE_PLACEHOLDER}
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
  );
};

export default ConditionValueSelect;
