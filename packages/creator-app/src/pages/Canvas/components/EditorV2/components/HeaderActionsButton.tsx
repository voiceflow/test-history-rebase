import { Utils } from '@voiceflow/common';
import { OptionsMenuOption, Select, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { useEditor } from '../hooks';
import StyledHeaderActionsButton from './StyledHeaderActionsButton';

interface HeaderActionsButtonProps {
  actions?: Array<OptionsMenuOption | UIOnlyMenuItemOption | null>;
}

const HeaderActionsButton: React.FC<HeaderActionsButtonProps> = ({ actions }) => {
  const editor = useEditor();

  const options: Array<OptionsMenuOption | UIOnlyMenuItemOption | null> = actions ?? [
    { label: 'Duplicate', onClick: () => editor.engine.node.duplicate(editor.nodeID) },
    { label: 'Delete', onClick: () => editor.engine.node.remove(editor.nodeID) },
  ];

  return (
    <Select<OptionsMenuOption>
      options={options.filter(Utils.array.isNotNullish)}
      minWidth={false}
      onSelect={(option) => option.onClick?.()}
      placement="bottom-end"
      getOptionKey={(_, index) => String(index)}
      renderTrigger={({ ref, isOpen, onClick }) => (
        <StyledHeaderActionsButton ref={ref as React.RefObject<HTMLButtonElement>} activeClick={isOpen} onClick={onClick} />
      )}
      getOptionLabel={(option) => option?.label}
    />
  );
};

export default HeaderActionsButton;
