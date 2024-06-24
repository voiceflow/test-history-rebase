'use client';

import { Avatar, Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { logoutAction } from '@/actions/auth.action';

interface ILayoutHeaderUser {
  name: string;
  email: string;
  image: string | null;
}

export const LayoutHeaderUser: React.FC<ILayoutHeaderUser> = ({ name, email, image }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button color="inherit" onClick={({ currentTarget }) => setAnchorEl(currentTarget)}>
        <Box display="flex" flexDirection="row" gap={2} alignItems="center">
          <Typography variant="subtitle1">{email}</Typography>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: image?.startsWith('http') ? undefined : `#${image?.split('|')?.[0]}`,
            }}
            src={image?.startsWith('http') ? image : ''}
          >
            {name.charAt(0)}
          </Avatar>
        </Box>
      </Button>

      <Menu
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => logoutAction()}>Log Out</MenuItem>
      </Menu>
    </>
  );
};
