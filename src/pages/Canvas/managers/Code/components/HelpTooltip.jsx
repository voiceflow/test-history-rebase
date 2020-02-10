import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

const EditorInfoPopup = () => (
  <>
    <Paragraph marginBottomUnits={2}>The Voiceflow code block uses ES6 Javascript.</Paragraph>
    <Paragraph marginBottomUnits={2}>
      Voiceflow variables are auto bound directly as javascript variables that have already been declared (autocomplete inside editor). _system
      variable is available for alexa. You can store anything that is json serializable in variables
    </Paragraph>
    <Title>Important</Title>
    <Paragraph>Voiceflow doesn't validate custom code for you, so be sure to check your code before publishing.</Paragraph>
  </>
);

export default EditorInfoPopup;
