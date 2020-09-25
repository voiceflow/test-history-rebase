import type { DraftJsBlockStyleButtonProps } from '@voiceflow/draft-js-buttons';
import { EditorState } from 'draft-js';
import utils from 'draft-js-plugins-utils';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Input from '@/components/Input';
import Portal from '@/components/Portal';
import { useDismissable } from '@/hooks/dismiss';
import { preventDefault, withEnterPress } from '@/utils/dom';

import { getFullTextSelection } from '../../utils';
import IconButton from '../IconButton';
import { PopoverContainer, Title } from './components';

export type HyperlinkProps = Omit<DraftJsBlockStyleButtonProps, 'children'> & {
  saveEditorState: (editorState: EditorState) => void;
  applyFakeSelection: (state: EditorState) => EditorState;
  removeFakeSelection: (state: EditorState) => EditorState;
  createLinkAtSelection: (editorState: EditorState, url: string) => EditorState;
  removeLinkAtSelection: (editorState: EditorState) => EditorState;
};

const Hyperlink: React.FC<HyperlinkProps> = ({
  getEditorState,
  setEditorState,
  saveEditorState,
  applyFakeSelection,
  removeFakeSelection,
  createLinkAtSelection,
  removeLinkAtSelection,
}) => {
  const editorState = getEditorState();

  const [entityKey, link] = React.useMemo(() => {
    let state = editorState;

    if (!state) {
      return [null, ''] as const;
    }

    const selection = state.getSelection();

    if (selection.isCollapsed()) {
      const content = state.getCurrentContent();
      const firstBlock = content.getFirstBlock();
      const length = firstBlock.getLength();

      if (selection.getFocusOffset() === length) {
        state = EditorState.acceptSelection(state, getFullTextSelection(state));
      }
    }

    const key = utils.getCurrentEntityKey(state);

    if (key === null) {
      return [null, ''] as const;
    }

    const contentState = editorState.getCurrentContent();
    const entity = contentState.getEntity(key);

    return [key, (entity.getData()?.url || '') as string];
  }, [editorState]);

  const [localLink, setLocalLink] = React.useState(link);

  const popperRef = React.useRef<HTMLElement>(null);

  const onClose = () => {
    setTimeout(() => {
      setEditorState(removeFakeSelection(getEditorState()));
    }, 100);
  };

  const [open, toggleOpen] = useDismissable(false, onClose, false, popperRef);

  const onShow = () => {
    setEditorState(applyFakeSelection(getEditorState()));
    toggleOpen();
  };

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLink(target.value);
  };

  const onBlur = () => {
    let state = getEditorState();

    const selection = state.getSelection();
    const prevEditorState = selection;
    const isCollapsed = selection.isCollapsed();

    if (isCollapsed) {
      state = EditorState.acceptSelection(state, getFullTextSelection(state));
    }

    if (!link) {
      state = createLinkAtSelection(state, localLink);
    } else if (!localLink) {
      state = removeLinkAtSelection(state);
    } else if (entityKey) {
      const content = state.getCurrentContent().mergeEntityData(entityKey, { url: localLink });

      state = EditorState.forceSelection(EditorState.push(editorState, content, 'apply-entity'), editorState.getSelection());
    }

    if (isCollapsed) {
      state = EditorState.acceptSelection(state, prevEditorState);
    }

    setEditorState(state);
    saveEditorState(state);
  };

  const onKeyPress = () => {
    onBlur();
    toggleOpen();
  };

  React.useEffect(() => {
    if (getEditorState()?.getSelection().getHasFocus()) {
      setLocalLink(link);
    }
  }, [link]);

  return (
    <Manager>
      <Reference>{({ ref }) => <IconButton ref={ref} icon="hyperlink" active={!!link || open} onClick={onShow} />}</Reference>

      {open && (
        <Portal portalNode={document.body}>
          <Popper
            innerRef={(node) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
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
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                  onChange={onChange}
                  onKeyPress={withEnterPress(preventDefault(onKeyPress))}
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
