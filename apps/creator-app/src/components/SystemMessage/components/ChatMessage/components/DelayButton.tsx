import { Input, Popper, preventDefault, TippyTooltip, useToggle, withHandler, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';

interface DelayButtonProps {
  delay?: number;
  onChange: (delay: number | undefined) => void;
}

const DelayButton: React.FC<DelayButtonProps> = ({ delay, onChange }) => {
  const [isOpened, toggleOpen] = useToggle(false);
  const [messageDelay, setMessageDelay] = React.useState(delay ? String(delay) : '');

  const onBlur = () => {
    const newMessageDelay = messageDelay;
    const persistedValue = newMessageDelay !== '' ? parseInt(newMessageDelay, 10) : undefined;

    onChange(persistedValue);
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
        <SlateEditable.PopperContent>
          <SlateEditable.PopperTitle>Message Delay (ms)</SlateEditable.PopperTitle>
          <Input
            type="number"
            min={0}
            value={messageDelay}
            onBlur={withHandler(onClose)(onBlur)}
            autoFocus
            placeholder="1000"
            onChangeText={setMessageDelay}
            onEnterPress={preventDefault(withInputBlur())}
            hideDefaultNumberControls
          />
        </SlateEditable.PopperContent>
      )}
    >
      {({ ref, isOpened }) => (
        <TippyTooltip content="Message Delay" placement="top">
          <SlateEditable.IconButton ref={ref} icon="systemMessageDelay" active={isOpened || !!messageDelay} onClick={preventDefault(toggleOpen)} />
        </TippyTooltip>
      )}
    </Popper>
  );
};

export default DelayButton;
