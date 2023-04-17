import { System } from '@voiceflow/ui';
import React from 'react';

import { configureSection, createExample } from '../utils';

export const SystemLinkAnchor = configureSection({
  path: 'src/system/link/link-anchor.component.tsx',
  title: 'System/Link/Anchor',
  description: 'Anchor Link component',

  examples: [
    [
      createExample('default', () => <System.Link.Anchor>anchor link</System.Link.Anchor>),
      createExample('active', () => <System.Link.Anchor active>anchor link</System.Link.Anchor>),
      createExample('disabled', () => <System.Link.Anchor disabled>anchor link</System.Link.Anchor>),
      createExample('decoration', () => <System.Link.Anchor textDecoration>anchor link</System.Link.Anchor>),
      createExample('active decoration', () => (
        <System.Link.Anchor active textDecoration>
          anchor link
        </System.Link.Anchor>
      )),
    ],

    [
      createExample('dark color', () => <System.Link.Anchor color={System.Link.Color.DARK}>anchor link</System.Link.Anchor>),
      createExample('inherit color', () => <System.Link.Anchor color={System.Link.Color.INHERIT}>anchor link</System.Link.Anchor>),
      createExample('custom color', () => <System.Link.Anchor color="#00eeff">anchor link</System.Link.Anchor>),
    ],
  ],
});

export const SystemLinkButton = configureSection({
  path: 'src/system/link/link-button.component.tsx',
  title: 'System/Link/Button',
  description: 'Button Link component',

  examples: [
    [
      createExample('default', () => <System.Link.Button>button link</System.Link.Button>),
      createExample('active', () => <System.Link.Button active>button link</System.Link.Button>),
      createExample('disabled', () => <System.Link.Button disabled>button link</System.Link.Button>),
      createExample('decoration', () => <System.Link.Button textDecoration>button link</System.Link.Button>),
      createExample('active decoration', () => (
        <System.Link.Button active textDecoration>
          button link
        </System.Link.Button>
      )),
    ],

    [
      createExample('dark color', () => <System.Link.Button color={System.Link.Color.DARK}>button link</System.Link.Button>),
      createExample('custom color', () => <System.Link.Button color="#00eeff">button link</System.Link.Button>),
      createExample('inherit color', () => <System.Link.Button color={System.Link.Color.INHERIT}>button link</System.Link.Button>),
    ],
  ],
});
