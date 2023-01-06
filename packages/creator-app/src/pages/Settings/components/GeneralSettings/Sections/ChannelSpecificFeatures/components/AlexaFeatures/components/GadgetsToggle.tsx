import * as Realtime from '@voiceflow/realtime-sdk';
import { Toggle } from '@voiceflow/ui';
import React from 'react';

import { SettingsSubSection } from '@/components/Settings/components';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import { Alexa } from '@/pages/Settings/components/ContentDescriptors';

const AlexaGadgetsToggle: React.OldFC = () => {
  const customInterfaceEnabled = useSelector(VersionV2.active.alexa.customInterfaceSelector);
  const patchSettings = useDispatch(Version.alexa.patchSettings);
  const gadgets = useFeature(Realtime.FeatureFlag.GADGETS);

  return (
    <>
      {gadgets.isEnabled && (
        <SettingsSubSection header="Custom Interface" rightDescription={<Alexa.Gadgets />}>
          <Toggle
            checked={!!customInterfaceEnabled}
            onChange={() => patchSettings({ customInterface: !customInterfaceEnabled })}
            size={Toggle.Size.SMALL}
            hasLabel
          />
        </SettingsSubSection>
      )}
    </>
  );
};

export default AlexaGadgetsToggle;
