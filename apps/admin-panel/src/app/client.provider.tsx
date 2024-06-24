'use client';

import { SnackbarProvider } from 'notistack';

export const ClientProvider = ({ children }: React.PropsWithChildren) => {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
};
