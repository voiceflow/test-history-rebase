import { Tooltip, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const standard = createExample('primary', ({ isPage }) => (
  <TutorialInfoIcon tooltipProps={{ initialOpened: isPage }}>
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
  </TutorialInfoIcon>
));

export default createSection('TutorialInfoIcon', 'src/components/TutorialInfoIcon/index.tsx', [standard]);
