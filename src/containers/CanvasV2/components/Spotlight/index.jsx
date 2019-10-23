import cuid from 'cuid';
import React from 'react';

import { NO_EDITOR_BLOCKS } from '@/constants';
import { EngineContext, SpotlightContext } from '@/containers/CanvasV2/contexts';
import MANAGERS from '@/containers/CanvasV2/managers';
import { MousePositionContext } from '@/contexts';

import { Container, Select } from './components';

const BLOCK_TYPES = MANAGERS.filter(({ type }) => !NO_EDITOR_BLOCKS.includes(type)).map(({ type, label }) => ({ value: type, label }));

export const filterSpotlightOption = (value, input) => value.label.toLowerCase().startsWith(input.toLowerCase().trim());

const Spotlight = () => {
  // NOTE: extra protection against context being falsy needed for HMR
  const { isVisible, hide } = React.useContext(SpotlightContext) || {};
  const mousePosition = React.useContext(MousePositionContext);
  const engine = React.useContext(EngineContext);

  const addBlock = (blockType) => {
    const position = engine.canvas.transformPoint(mousePosition.current);
    const newNodeID = cuid();

    engine.node.add(newNodeID, blockType, position);
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
        onChange={(selected) => addBlock(selected.value)}
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
