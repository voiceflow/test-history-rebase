import type { SvgIconTypes } from '@voiceflow/ui';
import { Input, Popper, preventDefault, TippyTooltip, useToggle, withHandler, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { PopperContent, PopperTitle } from '@/components/SlateEditable';
import IconButton from '@/components/SlateEditable/components/IconButton';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

interface MessageDelayButtonProps {
  icon?: SvgIconTypes.Icon;
  delay?: number;
  onChange: (delay: number | undefined) => void;
}

const MessageDelayButton: React.FC<MessageDelayButtonProps> = ({ icon = 'systemMessageDelay', delay, onChange }) => {
  const [isOpened, toggleOpen] = useToggle(false);
  const durationMilliseconds = useSelector(VersionV2.active.voiceflow.chat.messageDelaySelector);

  const [messageDelay, setMessageDelay] = React.useState(delay ? String(delay) : '');

  const onSave = () => {
    onChange(messageDelay !== '' ? parseInt(messageDelay, 10) : undefined);
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
            min={0}
            type="number"
            value={messageDelay}
            onBlur={withHandler(onClose)(onSave)}
            placeholder={String(durationMilliseconds)}
            onChangeText={setMessageDelay}
            onEnterPress={preventDefault(withInputBlur())}
            hideDefaultNumberControls
          />
        </PopperContent>
      )}
    >
      {({ ref, isOpened }) => (
        <TippyTooltip content="Message Delay" placement="top">
          <IconButton ref={ref} icon={icon} active={isOpened || !!messageDelay} onClick={preventDefault(toggleOpen)} />
        </TippyTooltip>
      )}
    </Popper>
  );
};

export default MessageDelayButton;
