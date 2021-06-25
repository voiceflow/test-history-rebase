import { Dropdown, Input, InputVariant } from '@voiceflow/ui';
import React from 'react';

import { useDiagramOptions, useDiagramRename } from '@/pages/Skill/hooks';
import { withEnterPress, withInputBlur, withTargetValue } from '@/utils/dom';

import DiagramDivider from './DiagramDivider';
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

  return (
    <>
      <DiagramDivider />

      {renameEnabled ? (
        <Input
          value={localName}
          onBlur={onSaveName}
          style={{ fontSize: '16px' }}
          variant={InputVariant.INLINE}
          onFocus={({ target }) => target.select()}
          onChange={withTargetValue(setLocalName)}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          onKeyPress={withEnterPress(withInputBlur())}
        />
      ) : (
        <Dropdown options={options} placement="bottom">
          {(ref, onToggle, isOpened) => (
            <DiagramName ref={ref} onClick={onToggle} active={isOpened} disabled={disabled || !options.length} highlighted>
              {diagramName}
            </DiagramName>
          )}
        </Dropdown>
      )}
    </>
  );
};

export default DiagramActions;
