import composeRef from '@seznam/compose-react-refs';
import { tid } from '@voiceflow/style';
import { Popper, Scroll, SquareButton, Surface, usePopperModifiers } from '@voiceflow/ui-next';
import React, { useRef } from 'react';

import { IPopperModalSettings } from './PopperModalSettings.interface';

export const PopperModalSettings: React.FC<IPopperModalSettings> = ({ testID, children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modifiers = usePopperModifiers([
    { name: 'preventOverflow', options: { boundary: globalThis.document?.body, padding: 32 } },
    { name: 'offset', options: { offset: [-20, 57] } },
  ]);

  return (
    <Popper
      testID={tid(testID, 'menu')}
      modifiers={modifiers}
      placement="right"
      referenceElement={({ ref, popper, onToggle, isOpen }) => (
        <SquareButton ref={composeRef(ref, buttonRef)} onClick={onToggle} isActive={isOpen} iconName={isOpen ? 'Minus' : 'Settings'} testID={testID}>
          {popper}
        </SquareButton>
      )}
      onPreventClose={(event) => {
        if (!event) return false;
        if (!buttonRef.current || !event.target) return true;
        return !buttonRef.current.contains(event.target as Node);
      }}
    >
      {() => (
        <Surface width="300px" direction="column" maxHeight="calc(100vh - 64px)" overflow="hidden">
          <Scroll style={{ display: 'block' }}>{children}</Scroll>
        </Surface>
      )}
    </Popper>
  );
};
