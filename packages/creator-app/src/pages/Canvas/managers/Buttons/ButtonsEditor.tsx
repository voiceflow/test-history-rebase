import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import * as Documentation from '@/config/documentation';
import ListEditorContent from '@/pages/Canvas/components/ListEditorContent';
import { useButtonLayoutOption, useIntentScope, useNoMatchOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { ButtonsListItem } from './components';
import { factory, NODE_CONFIG } from './constants';

const ButtonsEditor: NodeEditor<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = ({
  data,
  node,
  engine,
  nodeID,
  onChange,
  pushToPath,
}) => {
  const intentScopeOption = useIntentScope({ data, onChange });
  const buttonLayoutOption = useButtonLayoutOption();
  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });
  const [noMatchOption, noMatchSection] = useNoMatchOptionSection({ data, onChange, pushToPath });

  return (
    <ListEditorContent
      type="buttons-editor"
      items={data.buttons}
      footer={
        <>
          {noMatchSection}
          {noReplySection}
        </>
      }
      factory={factory}
      onRemove={(_, index) => engine.port.removeDynamic(node.ports.out.dynamic[index])}
      onReorder={(from, to) => engine.port.reorderDynamic(node.id, from, to)}
      renderMenu={() => <OverflowMenu placement="top-end" options={[noMatchOption, noReplyOption, buttonLayoutOption, intentScopeOption]} />}
      onChangeItems={(items) => onChange({ buttons: items })}
      itemComponent={ButtonsListItem}
      howItWorksLink={Documentation.BUTTONS_STEP}
      extraItemProps={{ pushToPath }}
      getControlOptions={({ onAdd, isMaxMatches, scrollToBottom }) => [
        {
          label: 'Add Button',
          icon: NODE_CONFIG.icon,
          onClick: Utils.functional.chainVoid(onAdd, () => engine.port.addDynamic(nodeID), scrollToBottom),
          disabled: isMaxMatches,
        },
      ]}
    />
  );
};

export default ButtonsEditor;
