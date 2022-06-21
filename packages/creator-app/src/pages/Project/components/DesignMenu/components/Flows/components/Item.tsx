import { ContextMenu, InputVariant, OverflowText } from '@voiceflow/ui';
import React from 'react';

import Members from '@/components/Members';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';
import { withEnterPress, withInputBlur, withTargetValue } from '@/utils/dom';

import ItemContainer from './ItemContainer';
import ItemInput from './ItemInput';

interface ItemProps {
  id: string;
  name: string;
  isActive: boolean;
}

const Item: React.FC<ItemProps> = ({ id, name, isActive }) => {
  const viewers = useSelector(DiagramV2.diagramViewersByIDSelector, { id });
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const { catEdit, localName, onSaveName, setLocalName, renameEnabled, toggleRenameEnabled } = useDiagramRename({
    diagramID: id,
    diagramName: name,
  });

  const options = useDiagramOptions({
    onRename: toggleRenameEnabled,
    diagramID: id,
  });

  return (
    <ContextMenu options={options}>
      {({ isOpen, onContextMenu }) => (
        <ItemContainer
          className={ClassName.FLOW_MENU_ITEM}
          onClick={isActive ? undefined : () => goToDiagram(id)}
          isActive={isActive}
          onContextMenu={id !== rootDiagramID ? onContextMenu : undefined}
          isContextMenuOpen={isOpen}
        >
          {renameEnabled ? (
            <ItemInput
              value={localName}
              onBlur={onSaveName}
              variant={InputVariant.INLINE}
              onFocus={({ target }) => target.select()}
              onChange={withTargetValue(setLocalName)}
              readOnly={!catEdit}
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              onKeyPress={withEnterPress(withInputBlur())}
            />
          ) : (
            <OverflowText>{localName}</OverflowText>
          )}
          <Members max={3} members={viewers} />
        </ItemContainer>
      )}
    </ContextMenu>
  );
};

export default Item;
