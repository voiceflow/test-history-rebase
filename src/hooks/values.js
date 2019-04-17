import { useRef, useState } from 'react';

import { isEqualArrays } from 'utils/arrays';

export const usePropControlledValue = (defaultValue = false, forceUpdateBy) => {
  const refValue = [defaultValue, forceUpdateBy];

  const ref = useRef(refValue);
  const [value, changeValue] = useState(defaultValue);

  if (!isEqualArrays(ref.current, refValue)) {
    changeValue(defaultValue);
    ref.current = refValue;
  }

  return [value, changeValue];
};

export const usePropsControlledValues = defaultValues => {
  const ref = useRef(defaultValues);
  const [values, changeValue] = useState(defaultValues);

  if (!isEqualArrays(ref.current, defaultValues)) {
    changeValue(defaultValues);
    ref.current = defaultValues;
  }

  return [values, newValues => changeValue(Object.assign([], values, newValues))];
};
