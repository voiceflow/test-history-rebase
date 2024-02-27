import { useFormik } from 'formik';

import { Values } from './card-form.scheme';

export interface Props {
  form: ReturnType<typeof useFormik<Values>>;
  disabled?: boolean;
}
