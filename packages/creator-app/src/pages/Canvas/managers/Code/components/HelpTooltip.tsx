import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={2}>The Voiceflow code block uses ES6 Javascript.</Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={2}>
      Voiceflow variables are auto bound directly as javascript variables that have already been declared (autocomplete inside editor). _system
      variable is available for alexa. You can store anything that is json serializable in variables
    </Tooltip.Paragraph>

    <Tooltip.Title>Important</Tooltip.Title>

    <Tooltip.Paragraph>Voiceflow doesn't validate custom code for you, so be sure to check your code before publishing.</Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
