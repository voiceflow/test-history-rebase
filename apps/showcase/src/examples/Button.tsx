import { Button, ButtonVariant, Flex } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const examples = [ButtonVariant.PRIMARY, ButtonVariant.SECONDARY, ButtonVariant.TERTIARY, ButtonVariant.QUATERNARY, ButtonVariant.WHITE].map(
  (variant) =>
    createExample(variant, () => (
      <Flex column gap={16}>
        <Button variant={variant}>Default Button</Button>
        {variant !== ButtonVariant.PRIMARY && variant !== ButtonVariant.SECONDARY && (
          <Button variant={variant} flat>
            Flat Button
          </Button>
        )}
        {variant !== ButtonVariant.PRIMARY && variant !== ButtonVariant.SECONDARY && (
          <Button variant={variant} squareRadius>
            Square Radius
          </Button>
        )}
        <Button variant={variant} isLoading>
          is loading
        </Button>
        {variant === ButtonVariant.WHITE && <Button variant={variant} tiny icon="closeSmall" />}
      </Flex>
    ))
);

const DarkButton = createExample('dark button', () => (
  <Flex column gap={16}>
    <Button.DarkButton>Default dark button</Button.DarkButton>
  </Flex>
));

examples.concat(DarkButton);

export default createSection('Button', 'src/components/Button/index.tsx', examples);
