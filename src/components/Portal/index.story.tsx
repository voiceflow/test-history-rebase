import React from 'react';

import { PortalContainer } from '@/../.storybook';

import Portal from '.';

export default {
  title: 'Portal',
  component: Portal,
  includeStories: [],
};

export const normal = () => (
  <Portal>
    <div>Portal content here</div>
  </Portal>
);

export const customPortal = () => (
  <PortalContainer>
    {({ portalNode }: { portalNode: HTMLElement }) => (
      <Portal portalNode={portalNode}>
        <div>Custom Portal content here</div>
      </Portal>
    )}
  </PortalContainer>
);
