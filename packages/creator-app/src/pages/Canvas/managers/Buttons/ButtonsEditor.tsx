import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import * as Documentation from '@/config/documentation';
import * as Creator from '@/ducks/creator';
import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';
import { NodeData } from '@/models';
import ListEditorContent from '@/pages/Canvas/components/ListEditorContent';
import { NoMatchSection } from '@/pages/Canvas/components/NoMatch';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useButtonLayoutOption, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { chainVoid } from '@/utils/functional';

import { ButtonsListItem } from './components';
import { factory, NODE_CONFIG } from './constants';

const ButtonsEditor: NodeEditor<NodeData.Buttons> = ({ data, nodeID, onChange, pushToPath }) => {
  const engine = React.useContext(EngineContext);

  const focusedNode = useSelector(Creator.focusedNodeSelector)!;
  const openIntents = useSelector(IntentV2.openIntentsSelector);

  const buttonLayoutOption = useButtonLayoutOption();
  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });

  return (
    <ListEditorContent
      type="buttons-editor"
      items={data.buttons}
      footer={
        <>
          <NoMatchSection data={data.else} pushToPath={pushToPath} />
          {noReplySection}
        </>
      }
      factory={factory}
      onRemove={(_, index) => engine?.port.remove(focusedNode.ports.out[index + 1])}
      onReorder={(from, to) => engine?.port.reorder(focusedNode.id, from + 1, to + 1)}
      renderMenu={() => <OverflowMenu placement="top-end" options={[noReplyOption, buttonLayoutOption]} />}
      onChangeItems={(items) => onChange({ buttons: items })}
      itemComponent={ButtonsListItem}
      howItWorksLink={Documentation.BUTTONS_STEP}
      extraItemProps={{ openIntents, pushToPath }}
      getControlOptions={({ onAdd, isMaxMatches, scrollToBottom }) => [
        {
          label: 'Add Button',
          icon: NODE_CONFIG.icon,
          onClick: chainVoid(onAdd, () => engine?.port.add(nodeID, { label: String(data.buttons.length + 1) }), scrollToBottom),
          disabled: isMaxMatches,
          iconProps: { color: NODE_CONFIG.iconColor },
        },
      ]}
    />
  );
};

export default ButtonsEditor;
