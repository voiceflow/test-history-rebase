import { action } from '@storybook/addon-actions';
import React from 'react';

import ContextMenu from '.';

const getProps = () => {
  const options = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `Option ${i}`, onClick: action(`onOption${i}Click`) }));

  return {
    options,
    onSelect: action('onSelect'),
  };
};

export default {
  title: 'Context Menu',
  component: ContextMenu,
};

export const base = () => {
  return (
    <ContextMenu {...getProps()}>
      {({ isOpen, onContextMenu }) => (
        <div style={{ padding: '20px' }} onContextMenu={onContextMenu}>
          {isOpen ? 'Open Menu' : 'Menu is opened'}
        </div>
      )}
    </ContextMenu>
  );
};
