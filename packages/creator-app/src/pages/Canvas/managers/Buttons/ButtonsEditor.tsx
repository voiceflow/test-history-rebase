import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import * as Documentation from '@/config/documentation';
import ListEditorContent from '@/pages/Canvas/components/ListEditorContent';
import { NoMatchSection } from '@/pages/Canvas/components/NoMatch';
import { useButtonLayoutOption, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
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
      onRemove={(_, index) => engine.port.removeDynamic(node.ports.out.dynamic[index])}
      onReorder={(from, to) => engine.port.reorderDynamic(node.id, from, to)}
      renderMenu={() => <OverflowMenu placement="top-end" options={[noReplyOption, buttonLayoutOption]} />}
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
