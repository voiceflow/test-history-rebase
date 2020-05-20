import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Input from '@/components/Input';
import Portal from '@/components/Portal';
import { useDismissable } from '@/hooks/dismiss';
import { preventDefault, withEnterPress } from '@/utils/dom';

import IconButton from '../IconButton';
import { PopoverContainer, Title } from './components';

export type HyperlinkProps = {
  link: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Hyperlink: React.FC<HyperlinkProps> = ({ link, onChange }) => {
  const popperRef = React.useRef<HTMLElement>(null);
  const [open, toggleOpen] = useDismissable(false, null, false, popperRef);

  return (
    <Manager>
      <Reference>{({ ref }) => <IconButton ref={ref} icon="hyperlink" active={!!link || open} onClick={toggleOpen} />}</Reference>

      {open && (
        <Portal portalNode={document.body}>
          <Popper
            innerRef={(node) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              popperRef.current = node;
            }}
            placement="bottom-start"
            modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
          >
            {({ ref, style }) => (
              <PopoverContainer ref={ref} style={style}>
                <Title>Hyplerlink</Title>
                <Input
                  value={link}
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                  onChange={onChange}
                  onKeyPress={withEnterPress(preventDefault(() => toggleOpen()))}
                  placeholder="Enter URL"
                />
              </PopoverContainer>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default Hyperlink;
