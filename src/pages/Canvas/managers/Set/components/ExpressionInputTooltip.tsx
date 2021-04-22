import React from 'react';

import InfoIcon from '@/components/InfoIcon';
import EditorFormControl from '@/pages/Canvas/components/Editor/components/EditorFormControl';

const ExpressionInputTooltip: React.FC = () => (
  <div style={{ display: 'inline-block' }}>
    <InfoIcon>
      This input accepts plain text, numbers, variables using "{'{'}" and mathematical expressions.
      <br />
      <br />
      <EditorFormControl>
        <b>The following math operations are supported:</b>
      </EditorFormControl>
      <ul>
        <li>+ addition</li>
        <li>- subtraction</li>
        <li>* multiplication</li>
        <li>/ division</li>
        <li>() brackets</li>
      </ul>
      <br />
      <EditorFormControl contentBottomUnits={1}>
        <b>Expression Example</b>
      </EditorFormControl>
      (2 * {'{level}'} - 10) / {'{time}'}
    </InfoIcon>
  </div>
);

export default ExpressionInputTooltip;
