import { createDividerMenuItemOption, SectionV2, SidebarEditor, SidebarEditorTypes, System, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import EditableText from '@/components/EditableText';
import { InteractionModelTabType } from '@/constants';
import { NLUContext, useNLUItemMenu } from '@/contexts/NLUContext';
import { useTheme } from '@/hooks';
import { EDITOR_LEFT_SIDEBAR_WIDTH, EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';

interface ItemEditSidebarProps extends React.PropsWithChildren {
  isBuiltIn?: boolean;
}

const ItemEditSidebar: React.FC<ItemEditSidebarProps> = ({ children, isBuiltIn }) => {
  const theme = useTheme();
  const nlu = React.useContext(NLUContext);
  const nluManager = useNLUManager();
  const { activeEntity, activeItemID } = nluManager;
  const activeTab = InteractionModelTabType.SLOTS;

  const [name, setName] = useLinkedState(activeEntity?.name ?? '');

  const { options } = useNLUItemMenu({
    itemID: nluManager.activeItemID,
    itemType: InteractionModelTabType.SLOTS,
    isBuiltIn,
  });

  const actions = options.map<SidebarEditorTypes.Action>((option) =>
    option.divider ? createDividerMenuItemOption(option.key) : { id: option.key, label: option.label, onClick: option.onClick }
  );

  const onBlurName = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.parentElement?.parentElement?.scrollTo({ left: 0 });

    if (activeEntity) {
      try {
        nlu.renameItem(name, activeEntity.id, activeTab);
      } catch (e) {
        setName(activeEntity?.name);
      }
    }
  };

  return (
    <Drawer open={!!activeEntity} width={EDITOR_LEFT_SIDEBAR_WIDTH} direction={Drawer.Direction.LEFT}>
      <SidebarEditor.Container>
        <SidebarEditor.Header
          style={nluManager.isEditorTabActive(EditorTabs.INTENT_CONFLICTS) ? { height: `${theme.components.page.header.height}px` } : {}}
        >
          <SidebarEditor.HeaderTitle fontWeight={800}>
            <EditableText
              value={name}
              onBlur={onBlurName}
              onChange={setName}
              startEditingOnFocus={!!activeItemID && nlu.canRenameItem(activeItemID, activeTab)}
            >
              {activeEntity?.name ?? ''}
            </EditableText>
          </SidebarEditor.HeaderTitle>

          <SectionV2.ActionsContainer gap={8}>
            <SidebarEditor.HeaderActionsButton actions={actions} />

            <System.IconButton.Base icon="close" onClick={() => nluManager.goToItem(null)} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SidebarEditor.Content $fillHeight autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
          {activeEntity && children}
        </SidebarEditor.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default ItemEditSidebar;
