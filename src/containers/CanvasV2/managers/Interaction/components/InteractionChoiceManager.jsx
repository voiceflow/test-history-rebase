import React from 'react';

import CardManagerItem from '@/components/CardManager/components/CardManagerItem';
import PlatformTooltip from '@/components/Tooltips/PlatformTooltip';
import Button from '@/componentsV2/Button';
import { FlexApart } from '@/componentsV2/Flex';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { activePlatformSelector, isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

import InteractionChoice from './InteractionChoice';

const interactionChoiceFactory = () => ({
  open: true,
  mappings: [],
});

function InteractionChoiceManager({ data, platform, onChange, focusedNode, isLive }) {
  const choices = data[platform];
  const engine = React.useContext(EngineContext);

  const updateChoices = React.useCallback((nextChoices, save) => onChange({ [platform]: nextChoices }, save), [platform, onChange]);
  const onRemoveChoice = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [focusedNode.ports.out]);

  const { onAdd, mapManaged } = useManager(choices, updateChoices, {
    autosave: false,
    factory: interactionChoiceFactory,
    handleRemove: onRemoveChoice,
  });

  const addChoice = React.useCallback(() => {
    onAdd();
    engine.port.add(focusedNode.id, { label: choices.length + 1 });
  }, [focusedNode.id, choices.length, onAdd]);

  return (
    <>
      <FlexApart>
        <label>Choices</label>
        <PlatformTooltip platform={platform} field="Interaction choices" />
      </FlexApart>
      <Button fullWidth variant="secondary" icon="plus" onClick={addChoice} disabled={isLive}>
        Add Choice
      </Button>
      {mapManaged((choice, { key, index, onRemove, onUpdate, toggleOpen }) => (
        <CardManagerItem key={key}>
          <InteractionChoice choice={choice} index={index} onRemove={onRemove} onUpdate={onUpdate} toggleOpen={toggleOpen} />
        </CardManagerItem>
      ))}
    </>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  isLive: isLiveSelector,
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(InteractionChoiceManager);
