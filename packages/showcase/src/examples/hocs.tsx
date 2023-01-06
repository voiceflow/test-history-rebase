import { Box, BoxFlexCenter, BoxProps } from '@voiceflow/ui';
import React from 'react';

export const withBox = (props?: BoxProps) => (Component: React.OldFC) => () =>
  (
    <Box {...(props as any)}>
      <Component />
    </Box>
  );

export const withBoxFlexCenter = (props?: BoxProps) => (Component: React.OldFC) => () =>
  (
    <BoxFlexCenter {...(props as any)}>
      <Component />
    </BoxFlexCenter>
  );
