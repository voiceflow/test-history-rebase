import { createUIOnlyMenuItemOption, IconButton, SectionV2, SidebarEditor, SidebarEditorTypes, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import EditableText from '@/components/EditableText';
import { NLUContext, useNLUItemMenu } from '@/contexts';
import { useTheme } from '@/hooks';
import { EDITOR_LEFT_SIDEBAR_WIDTH, EditorTabs } from '@/pages/NLUManager/constants';

import { useNLUManager } from '../context';

interface ItemEditSidebarProps {
  isBuiltIn?: boolean;
}

const ItemEditSidebar: React.FC<ItemEditSidebarProps> = ({ children, isBuiltIn }) => {
  const theme = useTheme();
  const nlu = React.useContext(NLUContext);
  const nluManager = useNLUManager();

  const [name, setName] = useLinkedState(nluManager.activeItem?.name ?? '');

  const { options } = useNLUItemMenu({
    itemID: nluManager.activeItemID,
    itemType: nluManager.activeTab,
    isBuiltIn,
  });

  const actions = options.map<SidebarEditorTypes.Action>((option) =>
    option.divider ? createUIOnlyMenuItemOption(option.key, { divider: true }) : { id: option.key, label: option.label, onClick: option.onClick }
  );

  const onBlurName = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.parentElement?.parentElement?.scrollTo({ left: 0 });

    if (nluManager.activeItem) {
      nlu.renameItem(name, nluManager.activeItem.id, nluManager.activeTab);
    }
  };

  return (
    <Drawer open={!!nluManager.activeItem} width={EDITOR_LEFT_SIDEBAR_WIDTH} direction={Drawer.Direction.LEFT}>
      <SidebarEditor.Container>
        <SidebarEditor.Header
          style={nluManager.isEditorTabActive(EditorTabs.INTENT_CONFLICTS) ? { height: `${theme.components.projectPage.header.height}px` } : {}}
        >
          <SidebarEditor.HeaderTitle fontWeight={800}>
            <EditableText
              value={name}
              onBlur={onBlurName}
              onChange={setName}
              startEditingOnFocus={!!nluManager.activeItemID && nlu.canRenameItem(nluManager.activeItemID, nluManager.activeTab)}
            >
              {nluManager.activeItem?.name ?? ''}
            </EditableText>
          </SidebarEditor.HeaderTitle>

          <SectionV2.ActionsContainer gap={8}>
            <SidebarEditor.HeaderActionsButton actions={actions} />

            <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} onClick={() => nluManager.goToItem(null)} offsetSize={0} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SidebarEditor.Content $fillHeight autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
          {nluManager.activeItem && children}
        </SidebarEditor.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default ItemEditSidebar;
