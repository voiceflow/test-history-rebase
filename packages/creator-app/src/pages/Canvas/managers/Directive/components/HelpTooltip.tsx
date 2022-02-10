import { Link } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import { DOCS_LINK } from '@/constants';

const EditorInfoPopup: React.FC<{ platform: VoiceflowConstants.PlatformType }> = ({ platform }) => {
  switch (platform) {
    case VoiceflowConstants.PlatformType.ALEXA:
      return (
        <Paragraph>
          The directive step will allow you to send customized directives for Alexa features that Voiceflow might not have a block for yet, or even
          emulate the behavior of an existing block with more details. Any valid JSON will be included in the <b>directives</b> array in the response
          sent back to Alexa.
          <br />
          <br />
          For more information, visit our
          <Link href={`${DOCS_LINK}/#/platform/steps/channel-steps/alexa-steps?id=directive-step`}> documentation.</Link>
        </Paragraph>
      );
    case VoiceflowConstants.PlatformType.GOOGLE:
      return (
        <Paragraph>
          The directive step will allow you to send customized directives for Google features that Voiceflow might not have a block for yet, or even
          emulate the behavior of an existing block with more details. Any valid JSON will be included in the <b>prompt</b> object in the response
          sent back to Google.
          <br />
          <br />
          For more information, visit our
          <Link href={`${DOCS_LINK}/#/platform/steps/channel-steps/google-steps?id=directive-step`}> documentation.</Link>
        </Paragraph>
      );
    default:
      return null;
  }
};

export default EditorInfoPopup;
