import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

const HelpTooltip: React.FC = () => (
  <>
    <Paragraph>
      The component block allows you to organize your project into re-usable components that can be referenced and re-used anywhere. If you’re have a
      visual design background, you can think of components a little like symbols in Sketch or Figma. If you’re a developer, you can think of
      components like components, or functions inside your project.
    </Paragraph>

    <Paragraph marginBottomUnits={2}>Components can be nested for further compartmentalization of your project.</Paragraph>

    <Title>Learn More</Title>

    <Paragraph>
      To learn more about components, and how they can be used check our documentation <Link href={Documentation.COMPONENT_STEP}>here.</Link>
    </Paragraph>
  </>
);

export default HelpTooltip;
