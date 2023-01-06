import { Input } from '@voiceflow/ui';
import React from 'react';

import { SettingsSubSection } from '@/components/Settings';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

const MessageDelay: React.OldFC = () => {
  const patchSettings = useDispatch(Version.chat.patchSettings);

  const durationMilliseconds = useSelector(VersionV2.active.voiceflow.chat.messageDelaySelector);

  const [delayDuration, setDelayDuration] = React.useState(durationMilliseconds);

  const onChangeDelay = async (val: string) => {
    const delay = parseInt(val, 10);
    setDelayDuration(delay);
  };

  const persistDelayDurationChange = async () => {
    let newDelayDuration = delayDuration;
    if (!newDelayDuration) {
      setDelayDuration(0);
      newDelayDuration = 0;
    }
    await patchSettings({
      messageDelay: {
        durationMilliseconds: newDelayDuration,
      },
    });
  };

  return (
    <SettingsSubSection
      header="Message Delay"
      leftDescription={<DescriptorContainer>The default time delay (MS) between your assistants responses.</DescriptorContainer>}
      growInput
    >
      <Input
        hideDefaultNumberControls
        value={delayDuration}
        onBlur={persistDelayDurationChange}
        onChangeText={onChangeDelay}
        placeholder="1000"
        type="number"
        min={0}
        rightAction={<div style={{ color: '#62778C', fontSize: '15px', fontWeight: 600 }}>MS</div>}
      />
    </SettingsSubSection>
  );
};

export default MessageDelay;
