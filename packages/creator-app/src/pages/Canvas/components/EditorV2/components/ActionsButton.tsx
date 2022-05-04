import { Select } from '@voiceflow/ui';
import React from 'react';

import { useEditor } from '../hooks';
import StyledActionsButton from './StyledActionsButton';

export interface Action {
  label: string;
  onClick: VoidFunction;
}

interface ActionsButtonProps {
  actions?: Action[];
}

const ActionsButton: React.FC<ActionsButtonProps> = ({ actions }) => {
  const editor = useEditor();

  const options: Action[] = actions ?? [
    { label: 'Duplicate', onClick: () => editor.engine.node.duplicate(editor.nodeID) },
    { label: 'Delete', onClick: () => editor.engine.node.remove(editor.nodeID) },
  ];

  return (
    <Select<Action>
      options={options}
      minWidth={false}
      onSelect={(option) => option.onClick()}
      placement="bottom-end"
      getOptionKey={(option) => option.label}
      renderTrigger={({ isOpen, onClick }) => <StyledActionsButton activeClick={isOpen} onClick={onClick} />}
      getOptionLabel={(option) => option?.label}
    />
  );
};

export default ActionsButton;
