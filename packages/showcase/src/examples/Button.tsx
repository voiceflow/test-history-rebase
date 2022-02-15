import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const primaryButton = createExample('primary', <Button>Primary Button</Button>);

const secondaryButton = createExample('secondary', <Button variant={ButtonVariant.SECONDARY}>Secondary Button</Button>);

const tertiaryButton = createExample('tertiary', <Button variant={ButtonVariant.TERTIARY}>Tertiary Button</Button>);

const quaternaryButton = createExample('quaternary', <Button variant={ButtonVariant.TERTIARY}>Quaternary Button</Button>);

export default createSection('Button', 'src/components/Button/index.tsx', [primaryButton, secondaryButton, tertiaryButton, quaternaryButton]);
