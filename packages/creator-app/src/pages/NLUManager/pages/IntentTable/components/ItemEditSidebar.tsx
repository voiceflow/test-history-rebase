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
  onBack?: VoidFunction;
  isBuiltIn?: boolean;
}

const ItemEditSidebar: React.FC<ItemEditSidebarProps> = ({ children, isBuiltIn, onBack }) => {
  const theme = useTheme();
  const nlu = React.useContext(NLUContext);
  const nluManager = useNLUManager();
  const { activeIntent, activeItemID } = nluManager;
  const activeTab = InteractionModelTabType.INTENTS;

  const [name, setName] = useLinkedState(activeIntent?.name ?? '');

  const { options } = useNLUItemMenu({
    itemID: nluManager.activeItemID,
    itemType: InteractionModelTabType.INTENTS,
    isBuiltIn,
  });

  const actions = options.map<SidebarEditorTypes.Action>((option) =>
    option.divider ? createDividerMenuItemOption(option.key) : { id: option.key, label: option.label, onClick: option.onClick }
  );

  const onBlurName = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.parentElement?.parentElement?.scrollTo({ left: 0 });

    if (activeIntent) {
      try {
        nlu.renameItem(name, activeIntent.id, activeTab);
      } catch (e) {
        setName(activeIntent?.name);
      }
    }
  };

  return (
    <Drawer open={!!activeIntent} width={EDITOR_LEFT_SIDEBAR_WIDTH} direction={Drawer.Direction.LEFT}>
      <SidebarEditor.Container>
        <SidebarEditor.Header
          style={nluManager.isEditorTabActive(EditorTabs.INTENT_CONFLICTS) ? { height: `${theme.components.page.header.height}px` } : {}}
        >
          {!!onBack && (
            <System.IconButtonsGroup.Base mr={12}>
              <System.IconButton.Base icon="largeArrowLeft" onClick={() => onBack()} />
            </System.IconButtonsGroup.Base>
          )}

          <SidebarEditor.HeaderTitle fontWeight={800}>
            <EditableText
              value={name}
              onBlur={onBlurName}
              readOnly={!!onBack}
              onChange={setName}
              startEditingOnFocus={!!activeItemID && nlu.canRenameItem(activeItemID, activeTab)}
            >
              {activeIntent?.name ?? ''}
            </EditableText>
          </SidebarEditor.HeaderTitle>

          <SectionV2.ActionsContainer gap={8}>
            <SidebarEditor.HeaderActionsButton actions={actions} />

            <System.IconButton.Base icon="close" onClick={nluManager.resetSelection} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SidebarEditor.Content $fillHeight autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
          {activeIntent && children}
        </SidebarEditor.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default ItemEditSidebar;
