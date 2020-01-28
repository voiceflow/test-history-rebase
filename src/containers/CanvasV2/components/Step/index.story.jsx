import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import NewBlock from '../Block/NewBlock';
import Step from '.';

storiesOf('Step', module).add(
  'variants',
  createTestableStory(() => {
    const onClickPort = action('click port');
    const props = { label: 'Step', onClickPort };

    return (
      <>
        <Variant label="primary">
          <NewBlock name="Block">
            <Step {...props} label="Primary Step" />
          </NewBlock>
        </Variant>
        <Variant label="secondary">
          <NewBlock name="Block">
            <Step labelVariant="secondary" {...props} label="Secondary Step" />
          </NewBlock>
        </Variant>
        <Variant label="with placeholder">
          <NewBlock name="Block">
            <Step labelVariant="secondary" placeholder="This step has a placeholder" onClickPort={onClickPort} />
          </NewBlock>
        </Variant>
        <Variant label="with icon">
          <NewBlock name="Block">
            <Step icon="code" iconColor="red" {...props} label="Step With Icon" />
          </NewBlock>
        </Variant>
        <Variant label="without port">
          <NewBlock name="Block">
            <Step withPort={false} {...props} label="Step Without Port  " />
          </NewBlock>
        </Variant>
        <Variant label="with long label">
          <NewBlock name="Block">
            <Step {...props} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
          </NewBlock>
        </Variant>
        <Variant label="with long label and no port">
          <NewBlock name="Block">
            <Step withPort={false} {...props} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
          </NewBlock>
        </Variant>
        <Variant label="active">
          <NewBlock name="Block">
            <Step isActive {...props} />
          </NewBlock>
        </Variant>
        <Variant label="with connected port">
          <NewBlock name="Block">
            <Step isConnected {...props} />
          </NewBlock>
        </Variant>
      </>
    );
  })
);
