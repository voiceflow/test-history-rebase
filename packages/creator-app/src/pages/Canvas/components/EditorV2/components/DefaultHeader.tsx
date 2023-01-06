import { IconButton, SectionV2, SidebarEditor, SidebarEditorTypes } from '@voiceflow/ui';
import React from 'react';

import { useEditor, useEditorDefaultActions } from '../hooks';

interface DefaultHeaderProps extends Partial<Omit<SidebarEditorTypes.HeaderProps, 'title'>> {
  title?: string;
  onBack?: VoidFunction;
  actions?: SidebarEditorTypes.Action[];
}

const DefaultHeader: React.OldFC<DefaultHeaderProps> = ({ title, actions, onBack }) => {
  const editor = useEditor();
  const defaultActions = useEditorDefaultActions();

  return (
    <SidebarEditor.Header>
      {!!onBack && (
        <SectionV2.ActionsContainer isLeft unit={0} offsetUnit={2.75}>
          <IconButton icon="largeArrowLeft" onClick={() => onBack()} variant={IconButton.Variant.BASIC} />
        </SectionV2.ActionsContainer>
      )}

      <SidebarEditor.HeaderTitle>{title ?? editor.label}</SidebarEditor.HeaderTitle>

      <SectionV2.ActionsContainer>
        <SidebarEditor.HeaderActionsButton actions={onBack ? [] : actions ?? defaultActions} />
      </SectionV2.ActionsContainer>
    </SidebarEditor.Header>
  );
};

export default DefaultHeader;
