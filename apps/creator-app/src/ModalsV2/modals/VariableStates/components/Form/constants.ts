import * as Yup from 'yup';

export const SCHEME = Yup.object({
  name: Yup.string().required('Name is required'),
  variables: Yup.array().min(1, 'At least one variable is required').required('Variables is required'),
});
