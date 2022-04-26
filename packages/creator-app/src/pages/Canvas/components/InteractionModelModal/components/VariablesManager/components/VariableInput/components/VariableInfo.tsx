import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const VariableInfoTooltip: React.FC = () => (
  <>
    <Tooltip.Title>Global Variables</Tooltip.Title>

    <Tooltip.Paragraph marginBottomUnits={2}>
      Global variables can be used anywhere in the project, and their values saved between sessions. Examples use cases include "score", "user_name",
      "sessions".
    </Tooltip.Paragraph>

    <Tooltip.Title>Flow Variables</Tooltip.Title>

    <Tooltip.Paragraph marginBottomUnits={2}>
      Flow variables are a more advanced concept and can only be used on this particular flow. Flow variables are reset as soon as the flow finishes.
      Flow variables are great as temporary variables used within the context of a flow. Example use cases include iteration counters, holding
      temporary values.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={2}>
      If a flow variable and a global variable have the same name, the flow variable takes precedence in the flow
    </Tooltip.Paragraph>
  </>
);

export default VariableInfoTooltip;
