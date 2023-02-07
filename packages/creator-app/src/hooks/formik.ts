import { FormikErrors, useFormik } from 'formik';
import React from 'react';

/**
 * doesn't support nested objects or arrays
 */
export const useFormikTouchedErrors = <T extends Record<string, string | number | boolean | undefined>>({
  errors,
  touched,
  submitCount,
}: ReturnType<typeof useFormik<T>>): Partial<FormikErrors<T>> =>
  React.useMemo(
    () => Object.fromEntries(Object.entries(errors).filter(([key]) => !!submitCount || touched[key as keyof T])) as Partial<FormikErrors<T>>,
    [errors, touched, submitCount]
  );
