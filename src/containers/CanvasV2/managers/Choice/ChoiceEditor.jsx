import cn from 'classnames';
import React from 'react';

import Button from '@/componentsV2/Button';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

import ChoiceInput from './components/ChoiceInput';

const choiceFactory = () => ({
  open: true,
  synonyms: [],
});

function ChoiceEditor({ data, onChange, focusedNode, isLive }) {
  const engine = React.useContext(EngineContext);
  const { onAdd, mapManaged } = useManager(data.choices, (choices) => onChange({ choices }), { factory: choiceFactory });

  const addChoice = () => {
    onAdd();
    engine.port.add(focusedNode.id, { label: data.choices.length + 1 });
  };
  const removeChoice = (onRemove, index) => () => {
    onRemove();
    engine.port.remove(focusedNode.ports.out[index + 1]);
  };

  return (
    <Content className={cn({ 'disabled-overlay': isLive })}>
      {mapManaged((choice, { key, index, onUpdate, onRemove }) => (
        <Section key={key}>
          <ChoiceInput index={index} choice={choice} onChange={onUpdate} onRemove={removeChoice(onRemove, index)} />
        </Section>
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
