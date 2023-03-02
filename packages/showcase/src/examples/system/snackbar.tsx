import { Box, System } from '@voiceflow/ui';
import React from 'react';

import { ComponentProps, configureSection, createExample } from '../utils';

const wrap = (Component: React.FC<ComponentProps>) => (props: ComponentProps) =>
  (
    <Box position="relative" height="150px" width="500px">
      <Component {...props} />
    </Box>
  );

export const SystemSnackbarBase = configureSection({
  path: 'src/system/snackbar/snackbar.component.tsx',
  title: 'System/Snackbar/Base',
  description: 'Base Snackbar component',

  examples: [
    [
      createExample(
        'default',
        wrap(() => (
          <System.Snackbar.Base>
            <System.Snackbar.Text>some text</System.Snackbar.Text>
          </System.Snackbar.Base>
        ))
      ),
    ],

    [
      createExample(
        'with icon',
        wrap(() => (
          <System.Snackbar.Base>
            <System.Snackbar.Icon icon="info" />
            <System.Snackbar.Text>some text</System.Snackbar.Text>
          </System.Snackbar.Base>
        ))
      ),
    ],

    [
      createExample(
        'with button',
        wrap(() => (
          <System.Snackbar.Base>
            <System.Snackbar.Icon icon="warning" />

            <System.Snackbar.Text>some text</System.Snackbar.Text>

            <System.Snackbar.Button>Dismiss</System.Snackbar.Button>
          </System.Snackbar.Base>
        ))
      ),
    ],

    [
      createExample(
        'clickable',
        wrap(() => (
          <System.Snackbar.Base onClick={() => {}}>
            <System.Snackbar.Icon icon="warning" />

            <System.Snackbar.Text>some text</System.Snackbar.Text>

            <System.Snackbar.Button>Dismiss</System.Snackbar.Button>
          </System.Snackbar.Base>
        ))
      ),
    ],
  ],
});
