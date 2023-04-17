import { Tooltip } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const standard = createExample('primary', ({ isPage }) => (
  <Tooltip
    anchorRenderer={({ ref, onToggle, isOpen }) => (
      <button ref={ref} onClick={onToggle}>
        Click me to {isOpen ? 'Close' : 'Open'}
      </button>
    )}
    initialOpened={isPage}
  >
    <Tooltip.Title>Tooltip Title</Tooltip.Title>

    <Tooltip.Paragraph>Paragraph</Tooltip.Paragraph>

    <Tooltip.Section>Section</Tooltip.Section>

    <Tooltip.Section marginBottomUnits={2}>
      <Tooltip.JSONCode
        html={`    <span>"Details"</span>:  {
        <span>"Name"</span>:  <span>"{FirstName}"</span>
        <span>"Country"</span>:  <span>"US"</span>
    }`}
      />
    </Tooltip.Section>
  </Tooltip>
));

export default createSection('Tooltip', 'src/components/Tooltip/index.tsx', [standard]);
