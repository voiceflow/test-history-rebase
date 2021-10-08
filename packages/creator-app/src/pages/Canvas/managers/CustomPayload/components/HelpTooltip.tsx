import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import { DOCS_LINK } from '@/constants';

const EditorInfoPopup: React.FC = () => {
  return (
    <Paragraph>
      The directive step will allow you to send customized payload for Dialogflow features that Voiceflow might not have a block for yet, or even
      emulate the behavior of an existing block with more details. Any valid JSON will be included in the <b>custom payload</b> array in the response
      sent back to Dialogflow.
      <br />
      <br />
      For more information, visit our
      <Link href={`${DOCS_LINK}/#/platform/steps/channel-steps/alexa-steps?id=directive-step`}> documentation.</Link>
    </Paragraph>
  );
};

export default EditorInfoPopup;
