import Box from '@ui/components/Box';
import { useLinkedState } from '@ui/hooks';
import { ThemeColor } from '@ui/styles';
import { withTargetValue } from '@ui/utils/dom';
import React from 'react';

import DefaultInput from './DefaultInput';

const EditLength: React.FC<{ value: number; onChange: (value: number) => void; max: number; min: number; defaultValue: number }> = ({
  min,
  max,
  value,
  onChange,
  defaultValue,
}) => {
  const [length, setLength] = useLinkedState<string>(String(value));
  const [error, setError] = React.useState(false);

  const onSave = () => {
    onChange((!error && Number(length)) || defaultValue);
  };

  const onUpdate = (input: string) => {
    const newLength = input.replace(/\D/g, '').substring(0, 4);
    setLength(newLength);

    const result = Number(newLength);
    if (result < min || result > max) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <>
      <DefaultInput
        placeholder={String(defaultValue)}
        type="text"
        value={length}
        onChange={withTargetValue(onUpdate)}
        onBlur={withTargetValue(onSave)}
        error={error}
      />
      {error && (
        <Box mt={11} fontSize={13} color={ThemeColor.RED}>
          Value must be {min}-{max}
        </Box>
      )}
    </>
  );
};

export default EditLength;
