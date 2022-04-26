import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const EditorInfoPopup: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      During shared prototyping, the user will always proceed down the default path when they run into the action step.
      <br />
      If debug mode is on, the test will stop on the action step and buttons are presented for which path to take.
    </Tooltip.Paragraph>

    <Tooltip.Title>Designer</Tooltip.Title>

    <Tooltip.Paragraph marginBottomUnits={3}>
      The action step allows for adding custom labels and paths to your canvas. This is useful for creating mock actions or paths. Here is an example
      of using an action step to simulate a payment.
      <br />
      <br />
      Name: <i>Credit Card Payment</i>
      <br />
      Path 1: <i>Payment Successful</i>
      <br />
      Path 2: <i>Payment Pending</i>
      <br />
      Path 3: <i>Card Denied</i>
    </Tooltip.Paragraph>

    <Tooltip.Title>Developer</Tooltip.Title>

    <Tooltip.Paragraph marginBottomUnits={3}>
      For developers using the <b>Dialog Management API</b>, the action step always produces a trace with the action name as <i>type</i>, and action
      details as <i>payload</i>.
      <br />
      <br />
      If your action name is part of the request <i>config.stopTypes</i>, you can determine which path to take in the next request.
      <br />
      <br />
      Developers can perform the actual custom action (such as calling stripe to make a credit card payment).
    </Tooltip.Paragraph>
  </>
);

export default EditorInfoPopup;
