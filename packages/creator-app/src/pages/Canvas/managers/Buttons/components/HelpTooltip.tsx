import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

const HelpTooltip: React.FC = () => (
  <>
    <Title>Follow Path</Title>

    <Paragraph>When selected, a button will have a ‘port’ attached to it on the canvas- allowing it to be linked to another block or step.</Paragraph>
    <Paragraph marginBottomUnits={3}>When the button is selected by the user, they will be navigated down the corresponding path.</Paragraph>

    <Title capitalize={false}>Go to Intent</Title>

    <Paragraph>When selected, the corresponding button will have an intent attached to it.</Paragraph>
    <Paragraph marginBottomUnits={3}>When the button is selected by the user, they will trigger the attached intent.</Paragraph>

    <Title>URL</Title>

    <Paragraph>When selected, the corresponding button will have a URL attached to it.</Paragraph>
    <Paragraph>When the button is selected by the user, they will open the corresponding URL in a new tab.</Paragraph>
  </>
);

export default HelpTooltip;
