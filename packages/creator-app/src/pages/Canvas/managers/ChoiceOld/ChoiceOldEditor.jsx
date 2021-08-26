import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';

import ChoiceItem from './components/ChoiceOldItem';

const choiceFactory = () => ({
  synonyms: [],
});

function ChoiceEditor({ data, onChange, focusedNode, pushToPath }) {
  const engine = React.useContext(EngineContext);

  const updateChoices = React.useCallback((choices, save) => onChange({ choices }, save), [onChange]);
  const onRemoveChoice = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [focusedNode.ports.out]);

  const { onAdd, mapManaged } = useManager(data.choices, updateChoices, {
    autosave: false,
    factory: choiceFactory,
    handleRemove: onRemoveChoice,
  });

  const addChoice = React.useCallback(
    async (scrollToBottom) => {
      await engine.port.add(focusedNode.id, { label: data.choices.length + 1 });
      onAdd();
      scrollToBottom();
    },
    [focusedNode.id, data.choices.length, onAdd]
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
}

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(ChoiceEditor);
