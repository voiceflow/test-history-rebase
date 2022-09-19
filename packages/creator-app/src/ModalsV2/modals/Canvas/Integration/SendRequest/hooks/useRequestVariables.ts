import * as Realtime from '@voiceflow/realtime-sdk';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import { deepVariableSearch, normalize } from '../utils';

const useRequestVariables = () => {
  const [variableValues, setVariableValues] = React.useState<Record<string, string>>({});
  const formattedData = React.useRef({});
  const hasVariables = !_isEmpty(variableValues);

  const updateVariableValue = (key: string, value: string) => {
    setVariableValues({ ...variableValues, [key]: value });
  };

  const normalizeAndSaveVariables = (data: Realtime.NodeData.CustomApi) => {
    if (!data) return null;

    const normalizedData = normalize(data);
    const usedVariables = deepVariableSearch(normalizedData) as string[];
    const normalizedVariableValues = usedVariables.reduce((acc, key) => ({ ...acc, [key]: null }), {});

    setVariableValues(normalizedVariableValues);

    formattedData.current = normalizedData;

    return usedVariables;
  };

  return { variableValues, formattedData: formattedData.current, hasVariables, updateVariableValue, normalizeAndSaveVariables };
};

export default useRequestVariables;
