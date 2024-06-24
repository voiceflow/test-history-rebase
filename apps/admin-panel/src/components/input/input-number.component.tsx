'use client';

import { TextField } from '@mui/material';
import { useSnackbar } from 'notistack';

interface IInputNumber {
  value: number;
  label: string;
  error?: string | undefined;
  readOnly?: boolean;
  zeroIsAllowed?: boolean;
  onValueChange?: (value: number) => void;
}

export const InputNumber = ({
  value,
  error,
  label,
  readOnly = false,
  onValueChange,
  zeroIsAllowed = false,
}: IInputNumber) => {
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
      type="number"
      value={value === 0 && !zeroIsAllowed ? '' : value}
      error={!!error}
      label={label}
      variant="standard"
      onClick={onClick}
      onChange={({ currentTarget }) => onValueChange?.(Number(currentTarget.value))}
      fullWidth
      InputProps={{ readOnly }}
      helperText={error}
    />
  );
};
