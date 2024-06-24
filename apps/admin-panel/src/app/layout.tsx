import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { LayoutHeader } from '@/components/layout/layout-header/layout-header.component';
import { LayoutSidebar } from '@/components/layout/layout-sidebar/layout-sidebar.component';
import { THEME } from '@/theme';

import { ClientProvider } from './client.provider';

const RootLayout = async ({ children }: React.PropsWithChildren) => {
  return (
    <html lang="en">
      <head>
        <title>Voiceflow Admin Panel</title>
      </head>

      <body style={{ width: '100%' }}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={THEME}>
            <ClientProvider>
              <CssBaseline />

              <Box display="flex">
                <LayoutSidebar />

                <Box width="100%">
                  <LayoutHeader />

                  <Box p={2}>{children}</Box>
                </Box>
              </Box>
            </ClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
