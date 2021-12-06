import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph } from '@/components/Tooltip';

const EditorInfoPopup: React.FC = () => {
  return (
    <Paragraph>
      The step will allow you to send customized response for Dialogflow features that Voiceflow might not have a block for yet, or even emulate the
      behavior of an existing block with more details. Any valid JSON will be included in the <b>custom response</b> array in the response sent back
      to Dialogflow.
      <br />
      <br />
      For more information, visit{' '}
      <Link href="https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook#webhook_response">the Dialogflow documentation.</Link>
    </Paragraph>
  );
};

export default EditorInfoPopup;
