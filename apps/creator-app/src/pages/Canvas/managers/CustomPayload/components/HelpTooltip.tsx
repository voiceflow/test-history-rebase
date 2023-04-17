import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const EditorInfoPopup: React.FC = () => (
  <Tooltip.Paragraph>
    The step will allow you to send customized response for Dialogflow features that Voiceflow might not have a block for yet, or even emulate the
    behavior of an existing block with more details. Any valid JSON will be included in the <b>custom response</b> array in the response sent back to
    Dialogflow.
    <br />
    <br />
    For more information, visit our <Link href={Documentation.CUSTOM_RESPOSE}>documentation</Link>.
  </Tooltip.Paragraph>
);

export default EditorInfoPopup;
