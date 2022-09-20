import * as Yup from 'yup';

import { VariableStateEditorValues } from './types';

export const defaultValues: VariableStateEditorValues = {
  name: '',
  startFrom: null,
  variables: [],
  variablesValues: {},
};

export const variableStateSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  variables: Yup.array().min(1, 'At least one variable is required').required('Variables is required'),
});
