import { Box, Link, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

const AlexaGadgetsToggle: React.FC = () => {
  const customInterfaceEnabled = useSelector(VersionV2.active.alexa.customInterfaceSelector);
  const patchSettings = useDispatch(Version.alexa.patchSettings);

  return (
    <Settings.SubSection header="Custom Interface">
      <Box.FlexApart gap={24} fullWidth>
        <Settings.SubSection.Description>
          Enable communication between your Skill and custom interfaces.{' '}
          <Link href="https://developer.amazon.com/en-US/docs/alexa/alexa-gadgets-toolkit/custom-interface.html">Custom Interfaces</Link> enable a
          skill to trigger gadget behaviors, and act on information it receives from a gadget.
        </Settings.SubSection.Description>

        <Toggle
          size={Toggle.Size.EXTRA_SMALL}
          checked={!!customInterfaceEnabled}
          onChange={() => patchSettings({ customInterface: !customInterfaceEnabled })}
          hasLabel
        />
      </Box.FlexApart>
    </Settings.SubSection>
  );
};

export default AlexaGadgetsToggle;
