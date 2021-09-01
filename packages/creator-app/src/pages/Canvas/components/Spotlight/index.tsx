import { preventDefault, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { useFeature, useTrackingEvents } from '@/hooks';
import { NodeData } from '@/models';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { getSections, MenuStep } from '@/pages/Skill/components/DesignMenu/components/Steps/constants';
import { PlatformContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';

import { Container, Select } from './components';

export const filterSpotlightOption = (value: { label: string }, input: string) => value.label.toLowerCase().startsWith(input.toLowerCase().trim());

const Spotlight = () => {
  const platform = React.useContext(PlatformContext)!;
  // NOTE: extra protection against context being falsy needed for HMR
  const spotlight = React.useContext(SpotlightContext);
  const [trackingEvents] = useTrackingEvents();
  const engine = React.useContext(EngineContext)!;
  const gadgets = useFeature(FeatureFlag.GADGETS);
  const isVisible = !!spotlight?.isVisible;

  const addBlock = async (blockType: BlockType, factoryData?: Partial<NodeData<unknown>>) => {
    await engine.node.add(blockType, engine.getMouseCoords(), factoryData);
    spotlight?.hide();
  };

  const options = React.useMemo(
    () =>
      getSections(platform)
        .flatMap((section) => section.steps)
        .filter((step) => {
          if (!gadgets.isEnabled && step.type === BlockType.EVENT) return false;
          if (IS_PRIVATE_CLOUD && step.publicOnly) return false;
          return true;
        }),
    []
  );

  useDidUpdateEffect(() => {
    if (isVisible) {
      trackingEvents.trackCanvasSpotlightOpened();
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Container id={Identifier.SPOTLIGHT} onClick={preventDefault()}>
      <Select
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === 'Escape') {
            spotlight?.hide();
            event.preventDefault();
          }
        }}
        onBlur={spotlight?.hide}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        classNamePrefix="spotlight"
        onChange={(selected: MenuStep) => {
          addBlock(selected.type, selected.factoryData);
          spotlight?.hide();
        }}
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
