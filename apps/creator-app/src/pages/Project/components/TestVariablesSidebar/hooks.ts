import { transformStringVariableToNumber } from '@voiceflow/common';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import * as Prototype from '@/ducks/prototype';
import { useSelector } from '@/hooks';
import type { Variable, VariableValue } from '@/models';

export const usePrototypeContextVariables = (
  initialVariables: Variable[],
  updateVariables: (variables: Record<string, VariableValue>) => void
): [Variable[], ({ name, value }: Variable) => void] => {
  const prototypeStatus = useSelector(Prototype.prototypeStatusSelector);
  const prototypeVariables = useSelector(Prototype.prototypeVariablesSelector);

  const isIdle = [PrototypeStatus.IDLE, PrototypeStatus.LOADING].includes(prototypeStatus);

  const onChange = React.useCallback(
    ({ name, value }: Variable) => {
      const updateFn = isIdle ? updateVariables : Prototype.updateVariables;

      updateFn({ [name]: transformStringVariableToNumber(value as string | number | null) });
    },
    [isIdle]
  );

  const variables = React.useMemo(
    () => (isIdle ? initialVariables : initialVariables.map(({ name }) => ({ name, value: prototypeVariables[name] }))),
    [isIdle, initialVariables, prototypeVariables]
  );

  return [variables, onChange];
};
