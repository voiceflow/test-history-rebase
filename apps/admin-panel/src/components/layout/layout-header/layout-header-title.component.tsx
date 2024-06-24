'use client';

import { Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import { VIEW_GROUP } from '@/views/views.constant';

export const LayoutHeaderTitle = () => {
  const params = useParams<{ group?: string; view?: string }>();

  const activeGroup = params.group ? VIEW_GROUP[params.group] : null;
  const activeView = params.view ? activeGroup?.views[params.view] : null;

  return (
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      {activeGroup?.name} / {activeView?.name}
    </Typography>
  );
};
