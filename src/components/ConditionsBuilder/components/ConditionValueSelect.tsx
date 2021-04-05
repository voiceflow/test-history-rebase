import React from 'react';

import Badge from '@/components/Badge';
import Input from '@/components/Input';
import { useEnableDisable } from '@/hooks';
import { withKeyPress } from '@/utils/dom';

export type ConditionValueSelectProps = {
  value?: string;
  onChange: (data: { value: string }) => void;
};

/**
 * TODO: replace input component with variable component CORE-5570
 * once above component is implemented,
 * following should be done before sending data to onChange
 *
 * the type of the expression should be set automatically under the hood based on the input value
 * variable -> type: variable
 * string/number -> type: value
 *
 * expected
 * onChange({ value, type })
 *
 */

const ConditionValueSelect: React.FC<ConditionValueSelectProps> = ({ value, onChange }) => {
  const [data, setData] = React.useState(value || '');
  const [show, onShow, onHide] = useEnableDisable(false);

  const onEnter = React.useCallback(() => {
    onHide();
    onChange({ value: data });
  }, [onChange]);

  return (
    <Input
      value={data}
      onBlur={onEnter}
      onChange={(e) => setData(e.target.value)}
      onFocus={onShow}
      onKeyPress={withKeyPress(13, onEnter)}
      rightAction={
        show &&
        data && (
          <Badge slide onClick={onEnter}>
            Enter
          </Badge>
        )
      }
      nested
    />
  );
};

export default ConditionValueSelect;
