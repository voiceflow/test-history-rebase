import type { SidebarEditorTypes } from '@voiceflow/ui';
import { SectionV2, SidebarEditor, System } from '@voiceflow/ui';
import React from 'react';

import { useEditor, useEditorDefaultActions } from '../hooks';

interface DefaultHeaderProps extends Partial<Omit<SidebarEditorTypes.HeaderProps, 'title'>> {
  title?: string;
  onBack?: VoidFunction;
  actions?: SidebarEditorTypes.Action[];
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ title, actions, onBack }) => {
  const editor = useEditor();
  const defaultActions = useEditorDefaultActions();

  return (
    <SidebarEditor.Header>
      {!!onBack && (
        <System.IconButtonsGroup.Base mr={12}>
          <System.IconButton.Base icon="largeArrowLeft" onClick={() => onBack()} />
        </System.IconButtonsGroup.Base>
      )}

      <SidebarEditor.HeaderTitle>{title ?? editor.label}</SidebarEditor.HeaderTitle>

      <SectionV2.ActionsContainer>
        <SidebarEditor.HeaderActionsButton actions={onBack ? [] : actions ?? defaultActions} />
      </SectionV2.ActionsContainer>
    </SidebarEditor.Header>
  );
};

export default DefaultHeader;
