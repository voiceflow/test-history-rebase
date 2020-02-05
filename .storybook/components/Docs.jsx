import * as DocsBlocks from '@storybook/addon-docs/blocks';
import React from 'react';

import { StoryContext } from '../contexts';

export const Meta = DocsBlocks.Meta;
export const Preview = DocsBlocks.Preview;
export const Props = DocsBlocks.Props;

export function Story({ name, labeled = true, children }) {
  return (
    <StoryContext.Provider value={{ name, labeled }}>
      <DocsBlocks.Story name={name}>{children}</DocsBlocks.Story>
    </StoryContext.Provider>
  );
}
