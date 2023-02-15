import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      Cards can enhance an interaction. For instance, voice responses need to be concise and "written for the ear". A card can provide additional,
      useful details that would make the voice response too verbose or too difficult to understand as speech.
    </Tooltip.Paragraph>

    <ul>
      <li>A simple card displays plain text. You provide text for the card title and content.</li>

      <li>
        A standard card also displays plain text, but can include an image. You provide the text for the title and content, and the URL for the image
        to display.
      </li>
    </ul>
  </>
);

export default HelpTooltip;
