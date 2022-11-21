import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Popper, preventDefault, TippyTooltip, withHandler, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { PopperContent, PopperTitle } from '@/components/SlateEditable';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { getDefaultNoReplyTimeoutSeconds } from '@/utils/noReply';

import * as S from './styles';

const NOT_NUMBERS_REGEX = /\D/g;

const MessageDelayPopper: React.FC = () => {
  const patchSettings = useDispatch(Version.patchSettings);
  const settings = useSelector(VersionV2.active.settingsSelector);
  const delay = settings?.globalNoReply?.delay ?? 10;
  const platform = useSelector(ProjectV2.active.platformSelector);
  const isNoReplyDelayEditable = Realtime.Utils.typeGuards.isPlatformWithEditableNoReplyDelay(platform);

  const [messageDelay, setMessageDelay] = React.useState(() => (delay ? String(delay) : ''));

  const onSave = () => {
    const newDelay = messageDelay !== '' ? parseInt(messageDelay, 10) : 10;

    if (String(newDelay) !== messageDelay) setMessageDelay(String(newDelay));

    if (newDelay === settings?.globalNoReply?.delay) return;

    patchSettings({
      globalNoReply: {
        ...(settings?.globalNoReply as Realtime.AnyVersion['settings']),
        delay: newDelay,
      },
    });
  };

  const handleTextChange = (newValue: string) => {
    if (!`${newValue}`.match(NOT_NUMBERS_REGEX)) {
      setMessageDelay(newValue);
    }
  };

  if (!isNoReplyDelayEditable) {
    return (
      <TippyTooltip title={`This value is not editable as it's defined by ${Platform.Config.get(platform).name}`}>
        <S.DelayTrigger>{getDefaultNoReplyTimeoutSeconds(platform)}</S.DelayTrigger>
      </TippyTooltip>
    );
  }

  return (
    <Popper
      renderContent={({ onClose }) => (
        <PopperContent>
          <PopperTitle>Delay (S)</PopperTitle>

          <S.DelayInput
            min={0}
            maxLength={3}
            type="text"
            value={messageDelay}
            onBlur={withHandler(onClose)(onSave)}
            autoFocus
            placeholder="10"
            onChangeText={handleTextChange}
            onEnterPress={preventDefault(withInputBlur())}
            hideDefaultNumberControls
            rightAction={
              String(delay) !== messageDelay ? (
                <Badge slide onClick={withHandler(onClose)(onSave)}>
                  Enter
                </Badge>
              ) : null
            }
          />
        </PopperContent>
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <S.DelayTrigger ref={ref} onClick={onToggle} active={isOpened}>
          {delay}
        </S.DelayTrigger>
      )}
    </Popper>
  );
};

export default MessageDelayPopper;
