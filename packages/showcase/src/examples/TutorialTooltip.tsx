import { ClickableText, Tooltip, TutorialTooltip } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const standard = createExample('primary', ({ isPage }) => (
  <TutorialTooltip
    title="Block Tutorial"
    initialOpened={isPage}
    anchorRenderer={({ isOpen }) => <ClickableText>{isOpen ? 'Close' : 'open'}</ClickableText>}
  >
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
  </TutorialTooltip>
));

export default createSection('TutorialTooltip', 'src/components/TutorialTooltip/index.tsx', [standard]);
