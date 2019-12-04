import cn from 'classnames';
import React from 'react';

import Button from '@/componentsV2/Button';
import { Content } from '@/containers/CanvasV2/components/BlockEditor';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

import ChoiceItem from './components/ChoiceItem';

const choiceFactory = () => ({
  open: true,
  synonyms: [],
});

function ChoiceEditor({ data, onChange, focusedNode, isLive }) {
  const engine = React.useContext(EngineContext);

  const updateChoices = React.useCallback((choices, save) => onChange({ choices }, save), [onChange]);
  const onRemoveChoice = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [focusedNode.ports.out]);

  const { onAdd, mapManaged } = useManager(data.choices, updateChoices, {
    autosave: false,
    factory: choiceFactory,
    handleRemove: onRemoveChoice,
  });

  const addChoice = React.useCallback(async () => {
    onAdd();
    await engine.port.add(focusedNode.id, { label: data.choices.length + 1 });
  }, [focusedNode.id, data.choices.length, onAdd]);

  return (
    <Content className={cn({ 'disabled-overlay': isLive })}>
      {mapManaged((choice, { key, index, onUpdate, onRemove }) => (
        <ChoiceItem key={key} index={index} choice={choice} onChange={onUpdate} onRemove={onRemove} />
      ))}
      <div className="editor-flex-container">
        <Button variant="secondary" onClick={addChoice} disabled={isLive}>
          Add Choice
        </Button>
      </div>
    </Content>
  );
}

const mapStateToProps = {
  isLive: isLiveSelector,
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(ChoiceEditor);
