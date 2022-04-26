import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph>
      The flow step allows you to organize your project into re-usable flows that can be referenced and re-used anywhere. If you have a visual design
      background, you can think of flows like symbols in Sketch or Figma. If you’re a developer, you can think of flows like functions inside your
      project.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={2}>Flows can be nested for further compartmentalization of your project.</Tooltip.Paragraph>

    <Tooltip.Title>Learn More</Tooltip.Title>

    <Tooltip.Paragraph>
      To learn more about flows, and how they can be used check our documentation <Link href={Documentation.COMPONENT_STEP}>here.</Link>
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
