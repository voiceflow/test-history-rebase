import React from 'react';

import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { useDidUpdateEffect, useFeature, useTrackingEvents } from '@/hooks';
import { NodeData } from '@/models';
import { EngineContext, PlatformContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { MenuStep, PLATFORM_SECTIONS } from '@/pages/Skill/menus/DesignMenu/components/Steps/constants';
import { Identifier } from '@/styles/constants';
import { preventDefault } from '@/utils/dom';

import { Container, Select } from './components';

export const filterSpotlightOption = (value: { label: string }, input: string) => value.label.toLowerCase().startsWith(input.toLowerCase().trim());

const Spotlight = () => {
  const platform = React.useContext(PlatformContext)!;
  // NOTE: extra protection against context being falsy needed for HMR
  const spotlight = React.useContext(SpotlightContext);
  const [trackingEvents] = useTrackingEvents();
  const engine = React.useContext(EngineContext)!;
  const gadgets = useFeature(FeatureFlag.GADGETS);
  const visualStep = useFeature(FeatureFlag.VISUAL_STEP);
  const isVisible = !!spotlight?.isVisible;

  const addBlock = async (blockType: BlockType, factoryData?: Partial<NodeData<unknown>>) => {
    await engine.node.add(blockType, engine.getMouseCoords(), factoryData);
    spotlight?.hide();
  };

  const options = React.useMemo(
    () =>
      PLATFORM_SECTIONS[platform]
        .flatMap((section) => section.steps)
        .filter((option) => {
          if (!gadgets.isEnabled && [BlockType.DIRECTIVE, BlockType.EVENT].includes(option.type)) return false;
          if (!visualStep.isEnabled && option.type === BlockType.VISUAL) return false;
          if (IS_PRIVATE_CLOUD && option.publicOnly) return false;
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
