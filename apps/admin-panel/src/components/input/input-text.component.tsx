'use client';

import { TextField } from '@mui/material';
import { useSnackbar } from 'notistack';

interface IInputText {
  value: string;
  label: string;
  error?: string | undefined;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
}

export const InputText = ({ value, error, label, readOnly = false, onValueChange }: IInputText) => {
  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    if (readOnly) {
      navigator.clipboard.writeText(String(value));

      enqueueSnackbar('Copied to clipboard', { variant: 'success' });
    }
  };

  return (
    <TextField
      size="small"
      value={value}
      error={!!error}
      label={label}
      variant="standard"
      onClick={onClick}
      onChange={({ currentTarget }) => onValueChange?.(currentTarget.value)}
      fullWidth
      InputProps={{ readOnly }}
      helperText={error}
    />
  );
};
