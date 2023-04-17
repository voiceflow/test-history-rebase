import { System } from '@voiceflow/ui';
import React from 'react';

import { configureSection, createExample } from '../utils';

export const SystemIconButtonBase = configureSection({
  path: 'src/system/icon-button/icon-button.component.tsx',
  title: 'System/IconButton/Base',
  description: 'Square icon button component',

  examples: [
    [
      createExample('default', () => <System.IconButton.Base icon="plus" />),
      createExample('active', () => <System.IconButton.Base icon="plus" active />),
      createExample('no hover background', () => <System.IconButton.Base icon="plus" hoverBackground={false} />),
      createExample('no hover and active background', () => <System.IconButton.Base icon="plus" hoverBackground={false} activeBackground={false} />),
    ],

    [
      createExample('extra small', () => <System.IconButton.Base icon="plus" size={System.IconButton.Size.XS} />),
      createExample('small', () => <System.IconButton.Base icon="plus" size={System.IconButton.Size.S} />),
      createExample('medium (default)', () => <System.IconButton.Base icon="plus" size={System.IconButton.Size.M} />),
      createExample('large', () => <System.IconButton.Base icon="plus" size={System.IconButton.Size.L} />),
      createExample('extra large', () => <System.IconButton.Base icon="plus" size={System.IconButton.Size.XL} />),
    ],

    [createExample('custom icon props', () => <System.IconButton.Base icon="plus" iconProps={{ color: '#0f0', spin: true }} />)],
  ],
});
