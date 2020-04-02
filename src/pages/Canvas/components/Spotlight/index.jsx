import cuid from 'cuid';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { BlockType, IntegrationType, NO_EDITOR_BLOCKS } from '@/constants';
import { MousePositionContext } from '@/contexts';
import { useFeature } from '@/hooks';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import MANAGERS from '@/pages/Canvas/managers';

import { Container, Select } from './components';

const BLOCK_TYPES = MANAGERS.filter(({ type }) => !NO_EDITOR_BLOCKS.includes(type)).map(({ type, label }) => ({ value: type, label }));
const BLOCK_TYPES_V2 = [
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

export const filterSpotlightOption = (value, input) => value.label.toLowerCase().startsWith(input.toLowerCase().trim());

const Spotlight = () => {
  // NOTE: extra protection against context being falsy needed for HMR
  const { isVisible, hide } = React.useContext(SpotlightContext) || {};
  const mousePosition = React.useContext(MousePositionContext);
  const engine = React.useContext(EngineContext);
  const { isEnabled: isBlockRedesignEnabled } = useFeature(FeatureFlag.BLOCK_REDESIGN);

  const addBlock = async (blockType, factoryData) => {
    const position = engine.canvas.transformPoint(mousePosition.current);
    const newNodeID = cuid();

    await engine.node.add(newNodeID, blockType, position, factoryData);
    hide();
  };

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
        onChange={(selected) => addBlock(selected.value, selected.factoryData)}
        options={isBlockRedesignEnabled ? BLOCK_TYPES_V2 : BLOCK_TYPES}
        maxMenuHeight={124}
        value={null}
        placeholder="Add Block"
        filterOption={filterSpotlightOption}
      />
    </Container>
  );
};

export default Spotlight;
