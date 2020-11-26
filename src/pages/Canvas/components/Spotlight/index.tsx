import React from 'react';

import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockType, INTERNAL_NODES, IntegrationType, MARKUP_NODES } from '@/constants';
import { useDidUpdateEffect, useFeature, useTrackingEvents } from '@/hooks';
import { NodeData } from '@/models';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import MANAGERS from '@/pages/Canvas/managers';

import { Container, Select } from './components';

export const NO_SPOTLIGHT_BLOCKS = [BlockType.INTEGRATION, BlockType.CHOICE_OLD, ...INTERNAL_NODES, ...MARKUP_NODES];

const BLOCK_TYPES = [
  ...MANAGERS.filter(({ type }) => !NO_SPOTLIGHT_BLOCKS.includes(type)).map(({ type, label }) => ({
    value: type,
    publicOnly: false,
    label,
  })),
  {
    value: BlockType.INTEGRATION,
    label: 'API',
    factoryData: { selectedIntegration: IntegrationType.CUSTOM_API },
    publicOnly: false,
  },
  {
    value: BlockType.INTEGRATION,
    label: 'Google Sheets',
    factoryData: { selectedIntegration: IntegrationType.GOOGLE_SHEETS },
    publicOnly: true,
  },
  {
    value: BlockType.INTEGRATION,
    label: 'Zapier',
    factoryData: { selectedIntegration: IntegrationType.ZAPIER },
    publicOnly: true,
  },
];

export const filterSpotlightOption = (value: { label: string }, input: string) => value.label.toLowerCase().startsWith(input.toLowerCase().trim());

const Spotlight = () => {
  // NOTE: extra protection against context being falsy needed for HMR
  const spotlight = React.useContext(SpotlightContext);
  const [trackingEvents] = useTrackingEvents();
  const engine = React.useContext(EngineContext)!;
  const gadgets = useFeature(FeatureFlag.GADGETS);

  const addBlock = async (blockType: BlockType, factoryData?: Partial<NodeData<unknown>>) => {
    await engine.node.add(blockType, engine.getMouseCoords(), factoryData);
    spotlight?.hide();
  };

  const options = React.useMemo(
    () =>
      BLOCK_TYPES.filter((option) => {
        if (!gadgets.isEnabled && [BlockType.DIRECTIVE, BlockType.EVENT].includes(option.value)) return false;
        if (IS_PRIVATE_CLOUD && option.publicOnly) return false;

        return true;
      }),
    []
  );

  useDidUpdateEffect(() => {
    if (spotlight?.isVisible) {
      trackingEvents.trackCanvasSpotlightOpened();
    }
  }, [spotlight?.isVisible]);

  if (!spotlight?.isVisible) {
    return null;
  }

  return (
    <Container>
      <Select
        onBlur={spotlight?.hide}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        classNamePrefix="spotlight"
        onChange={(selected: { value: BlockType; factoryData?: Partial<NodeData<unknown>> }) => addBlock(selected.value, selected.factoryData)}
        options={options}
        maxMenuHeight={124}
        value={null}
        placeholder="Add Block"
        filterOption={filterSpotlightOption}
      />
    </Container>
  );
};

export default Spotlight;
