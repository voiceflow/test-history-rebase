import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Popper, preventDefault, TippyTooltip, withHandler, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { PopperContent, PopperTitle } from '@/components/SlateEditable';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectPlatformConfig, useDispatch, useSelector } from '@/hooks';
import { getDefaultNoReplyTimeoutSeconds } from '@/utils/noReply';

import * as S from './styles';

const NOT_NUMBERS_REGEX = /\D/g;

const DEFAULT_DELAY = 10;

const MessageDelayPopper: React.FC = () => {
  const platformConfig = useActiveProjectPlatformConfig();

  const settings = useSelector(VersionV2.active.settingsSelector);
  const patchSettings = useDispatch(Version.patchSettings);

  const delay = settings?.globalNoReply?.delay ?? DEFAULT_DELAY;
  const isNoReplyDelayEditable = Realtime.Utils.typeGuards.isPlatformWithEditableNoReplyDelay(platformConfig.type);
  const [messageDelay, setMessageDelay] = React.useState(() => (delay ? String(delay) : ''));

  const onSave = () => {
    const newDelay = messageDelay !== '' ? parseInt(messageDelay, 10) : DEFAULT_DELAY;

    if (String(newDelay) !== messageDelay) setMessageDelay(String(newDelay));

    if (newDelay === settings?.globalNoReply?.delay) return;

    patchSettings({ globalNoReply: { ...settings?.globalNoReply, delay: newDelay } });
  };

  const handleTextChange = (newValue: string) => {
    if (!`${newValue}`.match(NOT_NUMBERS_REGEX)) {
      setMessageDelay(newValue);
    }
  };

  if (!isNoReplyDelayEditable) {
    return (
      <TippyTooltip content={`This value is not editable as it's defined by ${platformConfig.name}`}>
        <S.DelayTrigger>{getDefaultNoReplyTimeoutSeconds(platformConfig.type)}</S.DelayTrigger>
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
