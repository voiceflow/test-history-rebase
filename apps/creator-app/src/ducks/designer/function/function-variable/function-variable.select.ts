import { FunctionVariableType } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils';

import { createDesignerCRUDSelectors, functionIDParamSelector } from '../../utils';
import * as FunctionSelect from '../function.select';
import { STATE_KEY } from './function-variable.state';

const root = createSubSelector(FunctionSelect.root, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const allByFunctionID = createSelector(all, functionIDParamSelector, (functionVariables, functionID) => {
  return !functionID
    ? []
    : functionVariables
        .filter((functionVariable) => functionVariable.functionID === functionID)
        .sort((l, r) => new Date(r.createdAt).getTime() - new Date(l.createdAt).getTime());
});

export const countByFunctionID = createSelector(allByFunctionID, (functionVariables) => functionVariables.length);
export const inputByFunctionID = createSelector(allByFunctionID, (functionVariables) =>
  functionVariables.filter((functionVariable) => functionVariable.type === FunctionVariableType.INPUT)
);
export const outputByFunctionID = createSelector(allByFunctionID, (functionVariables) =>
  functionVariables.filter((functionVariable) => functionVariable.type === FunctionVariableType.OUTPUT)
);
