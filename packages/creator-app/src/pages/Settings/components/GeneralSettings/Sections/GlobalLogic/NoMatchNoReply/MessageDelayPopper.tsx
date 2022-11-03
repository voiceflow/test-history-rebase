import * as Realtime from '@voiceflow/realtime-sdk';
import { Input, Popper, preventDefault, withHandler, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { PopperContent, PopperTitle } from '@/components/SlateEditable';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

import * as S from './styles';

const MessageDelayPopper: React.FC = () => {
  const patchSettings = useDispatch(Version.patchSettings);
  const settings = useSelector(VersionV2.active.settingsSelector);
  const delay = settings?.globalNoReply?.delay ?? 0;

  const [messageDelay, setMessageDelay] = React.useState(() => (delay ? String(delay) : ''));

  const onSave = () => {
    const newDelay = messageDelay !== '' ? parseInt(messageDelay, 10) : undefined;

    if (newDelay === settings?.globalNoReply?.delay) return;

    patchSettings({
      globalNoReply: {
        ...(settings?.globalNoReply as Realtime.AnyVersion['settings']),
        delay: newDelay,
      },
    });
  };

  return (
    <Popper
      renderContent={({ onClose }) => (
        <PopperContent>
          <PopperTitle>Delay (S)</PopperTitle>

          <Input
            min={0}
            type="number"
            value={messageDelay}
            onBlur={withHandler(onClose)(onSave)}
            autoFocus
            placeholder="Seconds"
            onChangeText={setMessageDelay}
            onEnterPress={preventDefault(withInputBlur())}
            hideDefaultNumberControls
          />
        </PopperContent>
      )}
    >
      {({ ref, onToggle }) => (
        <S.DelayTrigger ref={ref} onClick={onToggle}>
          {delay}
        </S.DelayTrigger>
      )}
    </Popper>
  );
};

export default MessageDelayPopper;
