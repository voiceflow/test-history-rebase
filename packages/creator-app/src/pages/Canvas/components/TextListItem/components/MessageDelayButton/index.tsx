import { Node } from '@voiceflow/base-types';
import { Input, preventDefault, useToggle, withHandler, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import Popper from '@/components/Popper';
import { PopperContent, PopperTitle } from '@/components/SlateEditable';
import IconButton from '@/components/SlateEditable/components/IconButton';

interface MessageDelayButtonProps {
  onUpdate: (data: Partial<Node.Text.TextData>) => void;
  data: Node.Text.TextData;
}

const MessageDelayButton: React.FC<MessageDelayButtonProps> = ({ data, onUpdate }) => {
  const [isOpened, toggleOpen] = useToggle(false);
  const [messageDelay, setMessageDelay] = React.useState(data?.messageDelayMilliseconds ? String(data?.messageDelayMilliseconds) : '');

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
            placeholder="1000"
            onChangeText={setMessageDelay}
            onEnterPress={preventDefault(withInputBlur())}
          />
        </PopperContent>
      )}
    >
      {({ ref, isOpened }) => <IconButton ref={ref} icon="clock" active={isOpened} onClick={preventDefault(toggleOpen)} />}
    </Popper>
  );
};

export default MessageDelayButton;
