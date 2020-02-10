import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

function HelpTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>The Capture step allow you to ask the user a question and capture their response in a variable.</Paragraph>

      <Title>Example</Title>
      <Paragraph marginBottomUnits={3}>
        As an example, you can ask the user what their name is, and then use a capture block to capture the response into a variable called{' '}
        {'{user_name}'} and then use the user’s name in your skill using a speak block to better personalize the experience. If the user says a
        number, such as ‘six’, the response will automatically be converted to a number format (‘six’ turns to ‘6’) to allow you to capture and use
        numbers.
      </Paragraph>
    </>
  );
}

export default HelpTooltip;
