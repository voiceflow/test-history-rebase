'use client';

import { LoadingButton } from '@mui/lab';

interface IFormSubmitButton {
  label: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const FormSubmitButton = ({ label, loading = false, disabled }: IFormSubmitButton) => {
  return (
    <LoadingButton type="submit" disabled={disabled || loading} loading={loading}>
      {label}
    </LoadingButton>
  );
};
