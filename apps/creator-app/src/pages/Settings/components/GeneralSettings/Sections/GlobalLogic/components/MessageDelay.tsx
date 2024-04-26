import { Box, Input } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

const MessageDelay: React.FC = () => {
  const patchSettings = useDispatch(VersionV2.chat.patchSettings);

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

    await patchSettings({ messageDelay: { durationMilliseconds: newDelayDuration } });
  };

  return (
    <Settings.SubSection header="Message Delay" splitView>
      <Input
        min={0}
        type="number"
        value={delayDuration}
        onBlur={persistDelayDurationChange}
        placeholder="1000"
        rightAction={
          <Box color="#62778C" fontWeight={600}>
            MS
          </Box>
        }
        onChangeText={onChangeDelay}
        hideDefaultNumberControls
      />

      <Settings.SubSection.Description>
        The default time delay (MS) between your assistants responses.
      </Settings.SubSection.Description>
    </Settings.SubSection>
  );
};

export default MessageDelay;
