import { Input, Popper, preventDefault, SvgIconTypes, useToggle, withHandler } from '@voiceflow/ui';
import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import { Hotkey } from '../../constants';
import { useSlateEditor } from '../../contexts';
import { EditorAPI } from '../../editor';
import { useEditorHotkey } from '../../hooks';
import IconButton from '../IconButton';
import PopperContent from '../PopperContent';
import PopperTitle from '../PopperTitle';

interface ChildrenOptions {
  ref: React.Ref<any>;
  icon: SvgIconTypes.Icon;
  active: boolean;
  onMouseDown: React.MouseEventHandler<any>;
}

interface HyperlinkButtonProps {
  icon?: SvgIconTypes.Icon;
  children?: (option: ChildrenOptions) => React.ReactNode;
}

const HyperlinkButton: React.FC<HyperlinkButtonProps> = ({ children, icon = 'systemLinkText' }) => {
  const editor = useSlateEditor();

  const [isOpened, toggleOpen] = useToggle(false);
  const linkNode = EditorAPI.link(editor);
  const url = linkNode?.url ?? '';
  const [localUrl, setLocalUrl] = React.useState(url);

  const onBlur = () => {
    unstable_batchedUpdates(() => {
      if (linkNode && !localUrl) {
        EditorAPI.unwrapLink(editor);
      } else if (localUrl) {
        EditorAPI.wrapLink(editor, localUrl);
      }

      EditorAPI.removeFakeSelectionAndFocus(editor);
    });
  };

  useEditorHotkey(Hotkey.LINK, () => {
    toggleOpen();
  });

  React.useEffect(() => {
    if (EditorAPI.isFocused(editor)) {
      setLocalUrl(url);
    }
  }, [url]);

  return (
    <Popper
      width="300px"
      height="110px"
      opened={isOpened}
      onClose={toggleOpen}
      placement="bottom"
      modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
      portalNode={document.body}
      renderContent={({ onClose }) => (
        <PopperContent>
          <PopperTitle>Hyperlink</PopperTitle>
          <Input
            value={localUrl}
            onBlur={withHandler(onClose)(onBlur)}
            onFocus={editor.applyFakeSelection}
            autoFocus
            placeholder="Enter URL"
            onChangeText={(value) => setLocalUrl(value)}
            onEnterPress={preventDefault(({ currentTarget }) => currentTarget?.blur())}
          />
        </PopperContent>
      )}
    >
      {({ ref, isOpened }) =>
        children ? (
          children({ ref, icon, active: !!url || isOpened, onMouseDown: preventDefault(toggleOpen) })
        ) : (
          <IconButton ref={ref} icon={icon} active={!!url || isOpened} onMouseDown={preventDefault(toggleOpen)} />
        )
      }
    </Popper>
  );
};

export default HyperlinkButton;
