import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { useManager } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import ChoiceItem from './components/ChoiceOldItem';

const choiceFactory = () => ({
  synonyms: [],
});

const ChoiceEditor: NodeEditor<Realtime.NodeData.ChoiceOld> = ({ data, node, engine, onChange, pushToPath }) => {
  const updateChoices = React.useCallback(
    (choices: Realtime.NodeData.ChoiceOld['choices'], save?: boolean) => onChange({ choices }, save),
    [onChange]
  );

  const onRemoveChoice = React.useCallback(
    (_, index: number) => engine.port.removeOutDynamic(node.ports.out.dynamic[index]),
    [node.ports.out.dynamic]
  );

  const { onAdd, mapManaged } = useManager(data.choices, updateChoices, {
    autosave: false,
    factory: choiceFactory,
    handleRemove: onRemoveChoice,
  });

  const addChoice = React.useCallback(
    async (scrollToBottom: VoidFunction) => {
      await engine.port.addOutDynamic(node.id);

      onAdd();

      scrollToBottom();
    },
    [node.id, onAdd]
  );

  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={({ scrollToBottom }) => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption]} />}
          options={[
            {
              label: 'Add Choice',
              onClick: () => addChoice(scrollToBottom),
            },
          ]}
        />
      )}
    >
      {mapManaged((choice, { key, index, onUpdate, onRemove }) => (
        <ChoiceItem key={key} index={index} choice={choice} onChange={onUpdate} onRemove={onRemove} />
      ))}

      {noReplySection}
    </Content>
  );
};

export default ChoiceEditor;
