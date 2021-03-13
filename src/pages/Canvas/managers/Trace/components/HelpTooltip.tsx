import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

const EditorInfoPopup: React.FC = () => (
  <>
    <Paragraph marginBottomUnits={3}>
      During prototyping, the Trace step is passed through without any action. Upon reaching the block, the user will always proceed down the default
      path.
    </Paragraph>
    <Title>Designer</Title>
    <Paragraph marginBottomUnits={3}>
      The Trace step allows for adding custom labels and paths to your canvas. This is useful for creating mock actions or paths. Here is an example
      of using a Trace step to simulate a payment.
      <br />
      <br />
      Name: <i>Credit Card Payment</i>
      <br />
      Path 1: <i>Payment Successful</i>
      <br />
      Path 2: <i>Payment Pending</i>
      <br />
      Path 3: <i>Card Denied</i>
    </Paragraph>

    <Title>Developer</Title>
    <Paragraph marginBottomUnits={3}>
      For users deploying the the <b>voiceflow runtime</b>, the trace step can be acted upon by a custom handler, and determine the path to proceed
      on.
    </Paragraph>
    <Paragraph marginBottomUnits={3}>
      For users implementing the the <b>voiceflow runtime-client</b> SDK, the trace step will produce a specialized trace in the response, with{' '}
      <b>type: 'trace'</b>
    </Paragraph>
  </>
);

export default EditorInfoPopup;
