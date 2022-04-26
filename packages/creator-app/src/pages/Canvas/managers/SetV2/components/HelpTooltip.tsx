import { Tooltip, VideoPlayer } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Section marginBottomUnits={2.5}>
      <VideoPlayer src={Documentation.SET_STEP_VIDEO} height={210} />
    </Tooltip.Section>

    <Tooltip.Paragraph marginBottomUnits={2}>
      Set blocks can be used to manipulate variables based on actions a user has taken with your project.
    </Tooltip.Paragraph>

    <Tooltip.Title>Example</Tooltip.Title>

    <Tooltip.Paragraph marginBottomUnits={2}>
      Let’s say we’re making a quiz game and we’d like to update the users {'{score}'} variable based on the correct answer that was given. In this
      example we’d use a set block to set the variable {'{score}'} to {'{score}'} + 5. Assuming the question was worth five points.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph>
      Set blocks can be used in a wide array of scenarios such as counting the amount of sessions a user has had, updating a favourite order variable,
      or keeping track of purchases made- the use cases are endless.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
