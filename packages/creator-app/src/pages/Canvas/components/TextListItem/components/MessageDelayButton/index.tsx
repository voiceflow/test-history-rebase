import { BaseNode } from '@voiceflow/base-types';
import { Input, Popper, preventDefault, SvgIconTypes, TippyTooltip, useToggle, withHandler, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { PopperContent, PopperTitle } from '@/components/SlateEditable';
import IconButton from '@/components/SlateEditable/components/IconButton';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

interface MessageDelayButtonProps {
  onUpdate: (data: Partial<BaseNode.Text.TextData>) => void;
  data: BaseNode.Text.TextData;
  icon?: SvgIconTypes.Icon;
}

const MessageDelayButton: React.FC<MessageDelayButtonProps> = ({ data, onUpdate, icon = 'systemMessageDelay' }) => {
  const [isOpened, toggleOpen] = useToggle(false);
  const [messageDelay, setMessageDelay] = React.useState(data?.messageDelayMilliseconds ? String(data?.messageDelayMilliseconds) : '');
  const durationMilliseconds = useSelector(VersionV2.active.general.messageDelaySelector);

  const onBlur = () => {
    const newMessageDelay = messageDelay;
    const persistedValue = newMessageDelay !== '' ? parseInt(newMessageDelay, 10) : undefined;
    onUpdate?.({ messageDelayMilliseconds: persistedValue });
  };

  return (
    <Popper
      width="190px"
      height="110px"
      opened={isOpened}
      onClose={toggleOpen}
      placement="bottom"
      modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
      portalNode={document.body}
      renderContent={({ onClose }) => (
        <PopperContent>
          <PopperTitle>Message Delay (ms)</PopperTitle>
          <Input
            value={messageDelay}
            hideDefaultNumberControls
            onBlur={withHandler(onClose)(onBlur)}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            type="number"
            min={0}
            placeholder={String(durationMilliseconds)}
            onChangeText={setMessageDelay}
            onEnterPress={preventDefault(withInputBlur())}
          />
        </PopperContent>
      )}
    >
      {({ ref, isOpened }) => (
        <TippyTooltip title="Message Delay" position="top">
          <IconButton ref={ref} icon={icon} active={isOpened || !!messageDelay} onClick={preventDefault(toggleOpen)} />
        </TippyTooltip>
      )}
    </Popper>
  );
};

export default MessageDelayButton;
