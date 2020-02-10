import React from 'react';

import { Paragraph, Title } from '@/componentsV2/Tooltip';

const InfoTooltip = () => (
  <>
    <Paragraph marginBottomUnits={2}>
      When this option is checked, your random block will ignore paths that have already been activated until all paths in the random block have been
      activated.
    </Paragraph>
    <Title>Example</Title>
    <Paragraph marginBottomUnits={2}>
      Lets say we have 3 paths in our random block. Path A, B, and C. As expected, when the user hits this block the system will randomly choose path
      A, B, or C. For this example, let’s imagine path A was randomly chosen.
    </Paragraph>
    <Paragraph marginBottomUnits={2}>
      Now, let’s imagine a scenario where the user is looped back to this same random block and we have ‘No duplicates’ checked. The system will now
      ignore path A, as it’s already been activated and proceed by randomly choosing between path B, or C.
    </Paragraph>
    <Paragraph>If ‘No duplicates’ was not checked, the system would once again randomly select from path A, B, or C. </Paragraph>
  </>
);

export default InfoTooltip;
