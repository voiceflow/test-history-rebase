import React from 'react';

import OverflowMenu from '@/componentsV2/OverflowMenu';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor/components';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import { EngineContext } from '@/pages/Canvas/contexts';

import ChoiceItem from './components/ChoiceOldItem';

const choiceFactory = () => ({
  open: true,
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
      onAdd();
      await engine.port.add(focusedNode.id, { label: data.choices.length + 1 });
      scrollToBottom();
    },
    [focusedNode.id, data.choices.length, onAdd]
  );

  const hasReprompt = !!data.reprompt;
  const toggleReprompt = React.useCallback(() => onChange({ reprompt: hasReprompt ? null : repromptFactory() }), [hasReprompt, onChange]);

  return (
    <Content
      footer={({ scrollToBottom }) => (
        <Controls
          menu={
            <OverflowMenu
              placement="top-end"
              options={[
                {
                  label: hasReprompt ? 'Remove No Reply Response' : 'Add  No Reply Response',
                  onClick: toggleReprompt,
                },
              ]}
            />
          }
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
      {hasReprompt && <NoReplyResponse pushToPath={pushToPath} />}
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(ChoiceEditor);
