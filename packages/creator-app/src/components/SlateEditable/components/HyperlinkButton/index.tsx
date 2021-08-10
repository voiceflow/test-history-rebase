import { Icon, Input, preventDefault, withHandler } from '@voiceflow/ui';
import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import Popper from '@/components/Popper';
import { withEnterPress } from '@/utils/dom';

import { useSlateEditor } from '../../contexts';
import { EditorAPI } from '../../editor';
import IconButton from '../IconButton';
import { Content, Title } from './components';

interface ChildrenOptions {
  ref: React.Ref<any>;
  icon: Icon;
  active: boolean;
  onClick: React.MouseEventHandler<any>;
}

interface HyperlinkButtonProps {
  children?: (option: ChildrenOptions) => React.ReactNode;
}

const HyperlinkButton: React.FC<HyperlinkButtonProps> = ({ children }) => {
  const editor = useSlateEditor();

  const link = (EditorAPI.link(editor)?.url ?? '') as string;
  const [localLink, setLocalLink] = React.useState(link);

  const onBlur = () => {
    unstable_batchedUpdates(() => {
      if (!localLink) {
        EditorAPI.unwrapLink(editor);
      } else {
        EditorAPI.wrapLink(editor, localLink);
      }

      EditorAPI.removeFakeSelectionAndFocus(editor);
    });
  };

  React.useEffect(() => {
    if (EditorAPI.isFocused(editor)) {
      setLocalLink(link);
    }
  }, [link]);

  return (
    <Popper
      width="300px"
      height="110px"
      placement="bottom"
      modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
      portalNode={document.body}
      renderContent={({ onClose }) => (
        <Content>
          <Title>Hyperlink</Title>
          <Input
            value={localLink}
            onBlur={withHandler(onClose)(onBlur)}
            onFocus={editor.applyFakeSelection}
            onChange={({ target }) => setLocalLink(target.value)}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            onKeyPress={withEnterPress(preventDefault(({ currentTarget }) => currentTarget?.blur()))}
            placeholder="Enter URL"
          />
        </Content>
      )}
    >
      {({ ref, isOpened, onToggle }) =>
        children ? (
          children({ ref, icon: 'hyperlink', active: !!link || isOpened, onClick: preventDefault(onToggle) })
        ) : (
          <IconButton ref={ref} icon="hyperlink" active={!!link || isOpened} onClick={preventDefault(onToggle)} />
        )
      }
    </Popper>
  );
};

export default HyperlinkButton;
