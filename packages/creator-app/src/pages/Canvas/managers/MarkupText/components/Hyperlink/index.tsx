import { Input, Portal, preventDefault } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
import { unstable_batchedUpdates } from 'react-dom';
import { Manager, Popper, Reference } from 'react-popper';
import { Editor } from 'slate';

import { withEnterPress } from '@/utils/dom';

import MarkupSlateEditor from '../../MarkupSlateEditor';
import IconButton from '../IconButton';
import { PopoverContainer, Title } from './components';

export interface HyperlinkProps {
  editor: Editor;
}

const Hyperlink: React.FC<HyperlinkProps> = ({ editor }) => {
  const link = (MarkupSlateEditor.link(editor)?.url ?? '') as string;
  const [localLink, setLocalLink] = React.useState(link);

  const popperRef = React.useRef<HTMLElement | null>(null);

  const [open, toggleOpen] = useDismissable(false, { ref: popperRef });

  const onBlur = () => {
    unstable_batchedUpdates(() => {
      if (!localLink) {
        MarkupSlateEditor.unwrapLink(editor);
      } else {
        MarkupSlateEditor.wrapLink(editor, localLink);
      }

      MarkupSlateEditor.removeFakeSelectionAndFocus(editor);

      toggleOpen();
    });
  };

  React.useEffect(() => {
    if (MarkupSlateEditor.isFocused(editor)) {
      setLocalLink(link);
    }
  }, [link]);

  return (
    <Manager>
      <Reference>{({ ref }) => <IconButton ref={ref} icon="hyperlink" active={!!link || open} onClick={preventDefault(toggleOpen)} />}</Reference>

      {open && (
        <Portal portalNode={document.body}>
          <Popper
            innerRef={(node) => {
              popperRef.current = node;
            }}
            placement="bottom-start"
            modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
          >
            {({ ref, style }) => (
              <PopoverContainer ref={ref} style={style}>
                <Title>Hyperlink</Title>
                <Input
                  value={localLink}
                  onBlur={onBlur}
                  onFocus={editor.applyFakeSelection}
                  onChange={({ target }) => setLocalLink(target.value)}
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                  onKeyPress={withEnterPress(preventDefault(({ currentTarget }) => currentTarget?.blur()))}
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
