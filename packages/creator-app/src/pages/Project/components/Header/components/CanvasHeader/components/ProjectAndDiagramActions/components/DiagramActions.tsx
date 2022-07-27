import { Dropdown, Input, InputVariant } from '@voiceflow/ui';
import React from 'react';

import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { withInputBlur } from '@/utils/dom';

import DiagramName from './DiagramName';

interface DiagramActionsProps {
  disabled?: boolean;
  diagramID?: string | null;
  diagramName?: string | null;
}

const DiagramActions: React.FC<DiagramActionsProps> = ({ disabled, diagramID, diagramName }) => {
  const { localName, onSaveName, setLocalName, renameEnabled, toggleRenameEnabled } = useDiagramRename({
    diagramID,
    diagramName,
  });

  const options = useDiagramOptions({
    onRename: toggleRenameEnabled,
    diagramID,
  });

  return renameEnabled ? (
    <Input
      value={localName}
      onBlur={onSaveName}
      style={{ fontSize: '16px', minWidth: 30 }}
      variant={InputVariant.INLINE}
      onFocus={({ target }) => target.select()}
      autoFocus // eslint-disable-line jsx-a11y/no-autofocus
      onChangeText={setLocalName}
      onEnterPress={withInputBlur()}
    />
  ) : (
    <Dropdown options={options} placement="bottom">
      {(ref, onToggle, isOpened) => (
        <DiagramName ref={ref} onClick={onToggle} active={isOpened} disabled={disabled || !options.length} highlighted>
          {diagramName}
        </DiagramName>
      )}
    </Dropdown>
  );
};

export default DiagramActions;
