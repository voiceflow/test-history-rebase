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
          <Portal>
            <div>Portal content here</div>
          </Portal>
        </Variant>

        <Variant label="custom portal node">
          <PortalContainer>
            {({ portalNode }) => (
              <Portal portalNode={portalNode}>
                <div>Custom Portal content here</div>
              </Portal>
            )}
          </PortalContainer>
        </Variant>
      </>
    );
  })
);
