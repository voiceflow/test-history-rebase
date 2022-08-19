import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Flex, KeyName, preventDefault, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import ReactSelect from 'react-select';

import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';
import { useFeature, useTrackingEvents } from '@/hooks';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { useManager } from '@/pages/Canvas/managers/utils';
import { getStepSections, StepItem } from '@/pages/Project/components/StepMenu/constants';
import { PlatformContext, ProjectTypeContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';
import { withKeyPress } from '@/utils/dom';

import { Container, Control, Select } from '../Search/components';

const Spotlight = () => {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const projectType = React.useContext(ProjectTypeContext)!;
  // NOTE: extra protection against context being falsy needed for HMR
  const spotlight = React.useContext(SpotlightContext);

  const selectRef = React.useRef<ReactSelect>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [trackingEvents] = useTrackingEvents();
  const gadgets = useFeature(Realtime.FeatureFlag.GADGETS);
  const chatCardsCarousel = useFeature(Realtime.FeatureFlag.CHAT_CARDS_CAROUSEL);
  const promptStep = useFeature(Realtime.FeatureFlag.PROMPT_STEP);
  const getManager = useManager();

  const isVisible = !!spotlight?.isVisible;

  const onChange = async (step: StepItem) => {
    await engine.node.add(step.type, engine.getMouseCoords(), step.factoryData);

    spotlight?.hide();
  };

  const options = React.useMemo(
    () =>
      getStepSections(platform, projectType)
        .flatMap((section) => Utils.array.inferUnion(section.steps))
        .filter((step) => {
          if (!Utils.object.hasProperty(step, 'type')) return false;
          if (!gadgets.isEnabled && step.type === BlockType.EVENT) return false;
          if (!chatCardsCarousel.isEnabled && step.type === BlockType.CAROUSEL) return false;
          if (IS_PRIVATE_CLOUD && step.publicOnly) return false;
          if (!promptStep.isEnabled && step.type === BlockType.PROMPT) return false;
          return true;
        })
        .map((step) => {
          const manager = getManager(step.type);
          const value = step.getLabel(manager);
          return {
            ...step,
            value,
            label: (
              <Flex>
                <SvgIcon icon={step.getIcon(manager)} color="#F2F7F7D9" mb={-2} mr={12} />
                {value}
              </Flex>
            ),
          };
        }),
    [platform, gadgets.isEnabled, chatCardsCarousel.isEnabled, promptStep.isEnabled]
  );

  useDidUpdateEffect(() => {
    if (isVisible) {
      trackingEvents.trackCanvasSpotlightOpened();
    }
  }, [isVisible]);

  React.useLayoutEffect(() => {
    selectRef.current?.select.focusOption('first');
  }, [inputValue]);

  if (!isVisible) {
    return null;
  }

  const trimmedValue = inputValue.toLowerCase().trim();

  const filteredOptions = options
    .filter(({ value }) => value.toLowerCase().includes(trimmedValue))
    .sort((leftOption, rightOption) => leftOption.value.toLowerCase().indexOf(trimmedValue) - rightOption.value.toLowerCase().indexOf(trimmedValue));

  return (
    <Container id={Identifier.SPOTLIGHT} onClick={preventDefault()}>
      <Select
        ref={selectRef}
        value={null}
        onBlur={spotlight?.hide}
        options={filteredOptions}
        onChange={onChange}
        inputValue={inputValue}
        components={{
          Control,
          IndicatorsContainer: () => null,
        }}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onKeyDown={withKeyPress(KeyName.ESCAPE, () => spotlight?.hide())}
        placeholder="Add Block"
        filterOption={() => true}
        onInputChange={setInputValue}
        maxMenuHeight={124}
        classNamePrefix="search"
      />
    </Container>
  );
};

export default Spotlight;
