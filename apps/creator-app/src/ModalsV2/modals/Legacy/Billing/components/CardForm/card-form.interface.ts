import type { useFormik } from 'formik';

import type { Values } from './card-form.scheme';

export interface Props {
  form: ReturnType<typeof useFormik<Values>>;
  disabled?: boolean;
}
