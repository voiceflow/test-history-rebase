import React from 'react';

import ClickableText from '@/components/Text/ClickableText';
import { Paragraph, Title } from '@/components/Tooltip';

function HelpTooltip() {
  return (
    <>
      <Paragraph>
        The flow block allows you to organize your project into re-usable components that can be referenced and re-used anywhere. If you’re have a
        visual design background, you can think of flows a little like symbols in Sketch or Figma. If you’re a developer, you can think of flows like
        components, or functions inside your project.
      </Paragraph>
      <Paragraph marginBottomUnits={2}>Flows can be nested for further compartmentalization of your project.</Paragraph>
      <Title>Learn More</Title>
      <Paragraph>
        To learn more about flows, and how they can be used check our documentation{' '}
        <ClickableText link="https://docs.voiceflow.com/voiceflow-documentation/untitled/flow-block">here.</ClickableText>
      </Paragraph>
    </>
  );
}

export default HelpTooltip;
