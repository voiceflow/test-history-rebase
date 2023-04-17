import { Box, Portal, TippyTooltip, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';

import * as S from './styles';

interface GPTPopperProps extends React.ComponentProps<'div'> {
  label: string;
  storageKey: string;
  description: string;
}

const GPTPopper = React.forwardRef<HTMLDivElement, GPTPopperProps>(({ label, description, storageKey, ...props }, ref) => {
  const [doNotShowAgain, setDoNotShowAgain] = useLocalStorageState(`recommended-popper:${storageKey}`, false);

  return doNotShowAgain ? null : (
    <Portal portalNode={document.body}>
      <S.Container {...props} ref={ref}>
        <TippyTooltip.FooterButton onClick={() => setDoNotShowAgain(true)} buttonText="Don’t show this again">
          <div>
            ◦ '{HOTKEY_LABEL_MAP[Hotkey.GPT_GEN_ACCEPT_ITEM]}' to accept {label}
            <br />◦ '{HOTKEY_LABEL_MAP[Hotkey.GPT_GEN_REJECT_ITEM]}' to reject {label}
            <br />◦ '{HOTKEY_LABEL_MAP[Hotkey.GPT_GEN_ACCEPT_ALL]}' to accept all
            <br />◦ '{HOTKEY_LABEL_MAP[Hotkey.GPT_GEN_REJECT_ALL]}' to reject all
          </div>

          <Box mt="8px" color="#A2A7A8">
            {description}
          </Box>
        </TippyTooltip.FooterButton>
      </S.Container>
    </Portal>
  );
});

export default GPTPopper;
