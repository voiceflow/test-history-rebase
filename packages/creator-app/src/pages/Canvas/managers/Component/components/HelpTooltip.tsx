import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph>
      The component step allows you to organize your project into re-usable components that can be referenced and re-used anywhere. If you have a
      visual design background, you can think of components like symbols in Sketch or Figma. If you’re a developer, you can think of components like
      functions inside your project.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={2}>Components can be nested for further compartmentalization of your project.</Tooltip.Paragraph>

    <Tooltip.Title>Learn More</Tooltip.Title>

    <Tooltip.Paragraph>
      To learn more about components, and how they can be used check our documentation <Link href={Documentation.COMPONENT_STEP}>here.</Link>
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
