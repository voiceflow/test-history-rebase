'use client';

import { Card, CardActions, CardContent } from '@mui/material';

interface IFormCard {
  action?: React.ReactNode;
  children: React.ReactNode;
  onSubmit?: VoidFunction;
}

export const FormCard = ({ action, children, onSubmit: omSubmitProp }: IFormCard) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!omSubmitProp) return;

    omSubmitProp();
  };

  return (
    <form onSubmit={onSubmit}>
      <Card sx={{ minWidth: 440 }} variant="outlined">
        <CardContent>{children}</CardContent>

        {action && <CardActions>{action}</CardActions>}
      </Card>
    </form>
  );
};
