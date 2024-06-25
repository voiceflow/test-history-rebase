import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={2}>
      The stream step allows you to stream audio files longer than 240 seconds at a higher quality than than adding an
      audio file to a speak block. The stream block supports the following file types: MP3, AAC/MP4, HLS/M4U.
    </Tooltip.Paragraph>

    <Tooltip.Title>Important</Tooltip.Title>

    <Tooltip.Paragraph>
      The stream step was designed by Amazon in a way that works very differently than adding an audio file to a speak
      step. Unlike the speak step, when a user hits your stream step - the user is actually leaving your Skill. The user
      only returns to your skill if they say one of the Stream steps keyword functions: Alexa, Pause, Next, Previous.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
