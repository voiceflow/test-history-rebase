import { Box } from '@mui/material';

interface IView {
  form: React.ReactNode;
  children?: React.ReactNode;
}

export const View = ({ form, children }: IView) => (
  <Box gap={2} display="flex">
    {form}
    {children}
  </Box>
);
