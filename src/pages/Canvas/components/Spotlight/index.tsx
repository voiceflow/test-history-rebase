import React from 'react';

import { BlockType, IntegrationType, NO_EDITOR_BLOCKS } from '@/constants';
import { useDidUpdateEffect, useTrackingEvents } from '@/hooks';
import { NodeData } from '@/models';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import MANAGERS from '@/pages/Canvas/managers';

import { Container, Select } from './components';

const BLOCK_TYPES = [
  ...MANAGERS.filter(({ type }) => type !== BlockType.INTEGRATION && !NO_EDITOR_BLOCKS.includes(type)).map(({ type, label, labelV2 }) => ({
    value: type,
    label: labelV2 || label,
  })),
  {
    value: BlockType.INTEGRATION,
    label: 'API',
    factoryData: { selectedIntegration: IntegrationType.CUSTOM_API },
  },
  {
    value: BlockType.INTEGRATION,
    label: 'Google Sheets',
    factoryData: { selectedIntegration: IntegrationType.GOOGLE_SHEETS },
  },
  {
    value: BlockType.INTEGRATION,
    label: 'Zapier',
    factoryData: { selectedIntegration: IntegrationType.ZAPIER },
  },
];

export const filterSpotlightOption = (value: { label: string }, input: string) => value.label.toLowerCase().startsWith(input.toLowerCase().trim());

const Spotlight = () => {
  // NOTE: extra protection against context being falsy needed for HMR
  const { isVisible, hide } = React.useContext(SpotlightContext) || {};
  const [trackingEvents] = useTrackingEvents();
  const engine = React.useContext(EngineContext)!;

  const addBlock = async (blockType: BlockType, factoryData?: Partial<NodeData<unknown>>) => {
    const position = engine.getCanvasMousePosition();

    await engine.node.add(blockType, position, factoryData);
    hide?.();
  };

  useDidUpdateEffect(() => {
    if (isVisible) {
      trackingEvents.trackCanvasSpotlightOpened();
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Container>
      <Select
        onBlur={hide}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        classNamePrefix="spotlight"
        onChange={(selected: { value: BlockType; factoryData?: Partial<NodeData<unknown>> }) => addBlock(selected.value, selected.factoryData)}
        options={BLOCK_TYPES}
        maxMenuHeight={124}
        value={null}
        placeholder="Add Block"
        filterOption={filterSpotlightOption}
      />
    </Container>
  );
};

export default Spotlight;
