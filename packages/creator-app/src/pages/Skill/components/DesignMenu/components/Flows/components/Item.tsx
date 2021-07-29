import { InputVariant, OverflowText } from '@voiceflow/ui';
import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import Members from '@/components/Members';
import { FeatureFlag } from '@/config/features';
import * as Realtime from '@/ducks/realtime';
import * as RealtimeV2 from '@/ducks/realtimeV2';
import * as Router from '@/ducks/router';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { useFeature, useRealtimeSelector } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Skill/hooks';
import { ClassName } from '@/styles/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import { withEnterPress, withInputBlur, withTargetValue } from '@/utils/dom';

import ItemContainer from './ItemContainer';
import ItemInput from './ItemInput';

interface ItemProps {
  id: string;
  name: string;
  isActive: boolean;
}

const Item: React.FC<ItemProps & ConnectedItemProps> = ({ id, name, isActive, viewers, goToDiagram, rootDiagramID }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const viewersV2 = useRealtimeSelector((state) => RealtimeV2.diagramViewersByIDSelector(state, { id }));

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
          <Members max={3} members={atomicActions.isEnabled ? viewersV2 : viewers} />
        </ItemContainer>
      )}
    </ContextMenu>
  );
};

const mapStateToProps = {
  rootDiagramID: Version.activeRootDiagramIDSelector,
  getDiagramViewers: Realtime.diagramViewersSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagramHistoryPush,
};

const mergeProps = (...[{ getDiagramViewers }, , { id }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, ItemProps>) => ({
  viewers: getDiagramViewers(id),
});

type ConnectedItemProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Item);
