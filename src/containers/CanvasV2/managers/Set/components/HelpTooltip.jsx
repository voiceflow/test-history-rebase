import React from 'react';

import { Paragraph, Section, Title } from '@/componentsV2/Tooltip';
import VideoPlayer from '@/componentsV2/VideoPlayer';

import { VIDEO_LINK } from '../constants';

const HelpTooltip = () => (
  <>
    <Section marginBottomUnits={2.5}>
      <VideoPlayer link={VIDEO_LINK} height="210px" />
    </Section>
    <Paragraph marginBottomUnits={2}>Set blocks can be used to manipulate variables based on actions a user has taken with your project.</Paragraph>
    <Title>Example</Title>
    <Paragraph marginBottomUnits={2}>
      Let’s say we’re making a quiz game and we’d like to update the users {'{score}'} variable based on the correct answer that was given. In this
      example we’d use a set block to set the variable {'{score}'} to {'{score}'} + 5. Assuming the question was worth five points.
    </Paragraph>
    <Paragraph>
      Set blocks can be used in a wide array of scenarios such as counting the amount of sessions a user has had, updating a favourite order variable,
      or keeping track of purchases made- the use cases are endless.
    </Paragraph>
  </>
);

export default HelpTooltip;
