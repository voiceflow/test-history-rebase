import { System } from '@voiceflow/ui';
import React from 'react';

import { configureSection, createExample } from '../utils';

export const SystemIconButtonsGroupBase = configureSection({
  path: 'src/system/icon-buttons-group/icon-buttons-group.component.tsx',
  title: 'System/IconButtonsGroup/Base',
  description:
    'A group component to add gap between icon buttons and negative margins to adjust the first and last icon buttons position. Based on the `Box` component.',

  examples: [
    createExample('default', () => (
      <System.IconButtonsGroup.Base>
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Base>
    )),

    createExample('multiple icons', () => (
      <System.IconButtonsGroup.Base>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Base>
    )),

    createExample('custom gap', () => (
      <System.IconButtonsGroup.Base gap={4}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Base>
    )),

    createExample('mr=0', () => (
      <System.IconButtonsGroup.Base mr={0}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Base>
    )),

    createExample('ml=0', () => (
      <System.IconButtonsGroup.Base ml={0}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Base>
    )),
  ],
});

export const SystemIconButtonsGroupVertical = configureSection({
  path: 'src/system/icon-buttons-group/icon-buttons-group-vertical.component.tsx',
  title: 'System/IconButtonsGroup/Vertical',
  description: 'Extends the `IconButtonsGroup.Base` component. Removes horizontal negative margins.',

  examples: [
    createExample('default', () => (
      <System.IconButtonsGroup.Vertical>
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Vertical>
    )),

    createExample('multiple icons', () => (
      <System.IconButtonsGroup.Vertical>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Vertical>
    )),

    createExample('custom gap', () => (
      <System.IconButtonsGroup.Vertical gap={4}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Vertical>
    )),

    createExample('mr=0', () => (
      <System.IconButtonsGroup.Vertical mr={0}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Vertical>
    )),

    createExample('ml=0', () => (
      <System.IconButtonsGroup.Vertical ml={0}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Vertical>
    )),
  ],
});

export const SystemIconButtonsGroupHorizontal = configureSection({
  path: 'src/system/icon-buttons-group/icon-buttons-group-horizontal.component.tsx',
  title: 'System/IconButtonsGroup/Horizontal',
  description: 'Extends the `IconButtonsGroup.Base` component. Removes vertical negative margins.',

  examples: [
    createExample('default', () => (
      <System.IconButtonsGroup.Horizontal>
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Horizontal>
    )),

    createExample('multiple icons', () => (
      <System.IconButtonsGroup.Horizontal>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Horizontal>
    )),

    createExample('custom gap', () => (
      <System.IconButtonsGroup.Horizontal gap={4}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Horizontal>
    )),

    createExample('mr=0', () => (
      <System.IconButtonsGroup.Horizontal mr={0}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Horizontal>
    )),

    createExample('ml=0', () => (
      <System.IconButtonsGroup.Horizontal ml={0}>
        <System.IconButton.Base icon="plus" />
        <System.IconButton.Base icon="ellipsis" />
      </System.IconButtonsGroup.Horizontal>
    )),
  ],
});
