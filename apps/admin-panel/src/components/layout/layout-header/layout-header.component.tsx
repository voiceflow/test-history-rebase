import { AppBar, Toolbar } from '@mui/material';

import { identityClient } from '@/clients/identity.client';

import { LayoutHeaderTitle } from './layout-header-title.component';
import { LayoutHeaderUser } from './layout-header-user.component';

export const LayoutHeader = async () => {
  const user = await identityClient.user.findSelf();

  return (
    <AppBar position="static">
      <Toolbar>
        <LayoutHeaderTitle />

        <LayoutHeaderUser name={user.name} email={user.email} image={user.image} />
      </Toolbar>
    </AppBar>
  );
};
