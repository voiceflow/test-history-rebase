import { Box, BoxProps } from '@voiceflow/ui';
import React from 'react';

export const withBox = (props?: BoxProps) => (Component: React.FC) => () =>
  (
    <Box {...(props as any)}>
      <Component />
    </Box>
  );

export const withBoxFlexCenter = (props?: BoxProps) => (Component: React.FC) => () =>
  (
    <Box.FlexCenter {...(props as any)}>
      <Component />
    </Box.FlexCenter>
  );
