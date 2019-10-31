import { storiesOf } from '@storybook/react';
import React from 'react';

import { PortalContainer, Variant, createTestableStory } from '@/../.storybook';

import Portal from '.';

storiesOf('Portal', module).add(
  'variants',
  createTestableStory(() => {
    return (
      <>
        <Variant label="basic">
          <Portal>Portal content here</Portal>
        </Variant>

        <Variant label="custom portal node">
          <PortalContainer>{({ portalNode }) => <Portal portalNode={portalNode}>Custom Portal content here</Portal>}</PortalContainer>
        </Variant>
      </>
    );
  })
);
