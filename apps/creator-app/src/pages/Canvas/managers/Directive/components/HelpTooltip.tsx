import * as Platform from '@voiceflow/platform-config';
import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const EditorInfoPopup: React.FC<{ platform: Platform.Constants.PlatformType }> = ({ platform }) => {
  switch (platform) {
    case Platform.Constants.PlatformType.ALEXA:
      return (
        <Tooltip.Paragraph>
          The directive step will allow you to send customized directives for Alexa features that Voiceflow might not have a block for yet, or even
          emulate the behavior of an existing block with more details. Any valid JSON will be included in the <b>directives</b> array in the response
          sent back to Alexa.
          <br />
          <br />
          For more information, visit our
          <Link href={Documentation.ALEXA_DIRECTIVE_STEP}> documentation.</Link>
        </Tooltip.Paragraph>
      );
    case Platform.Constants.PlatformType.GOOGLE:
      return (
        <Tooltip.Paragraph>
          The directive step will allow you to send customized directives for Google features that Voiceflow might not have a block for yet, or even
          emulate the behavior of an existing block with more details. Any valid JSON will be included in the <b>prompt</b> object in the response
          sent back to Google.
          <br />
          <br />
          For more information, visit our
          <Link href={Documentation.GOOGLE_DIRECTIVE_STEP}> documentation.</Link>
        </Tooltip.Paragraph>
      );
    default:
      return null;
  }
};

export default EditorInfoPopup;
