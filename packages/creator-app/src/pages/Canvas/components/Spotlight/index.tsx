import * as Realtime from '@voiceflow/realtime-sdk';
import { Flex, KeyName, preventDefault, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import ReactSelect from 'react-select';

import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { useManager } from '@/pages/Canvas/managers/utils';
import { getStepSections, StepItem } from '@/pages/Project/components/StepMenu/constants';
import { PlatformContext, ProjectTypeContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';
import { withKeyPress } from '@/utils/dom';
import { isDialogflowPlatform } from '@/utils/typeGuards';

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
  const dfCarousel = useFeature(Realtime.FeatureFlag.DF_CAROUSEL_STEP);
  const topicsAndComponents = useFeature(Realtime.FeatureFlag.TOPICS_AND_COMPONENTS);
  const promptStep = useFeature(Realtime.FeatureFlag.PROMPT_STEP);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);
  const newEditors2 = useFeature(Realtime.FeatureFlag.NEW_EDITORS_PART_2);
  const getManager = useManager();

  const isVisible = !!spotlight?.isVisible;

  const onChange = async (step: StepItem) => {
    await engine.node.add(step.type, engine.getMouseCoords(), step.factoryData);

    spotlight?.hide();
  };

  const options = React.useMemo(
    () =>
      getStepSections(platform, projectType)
        .flatMap((section) => section.steps)
        .filter((step) => {
          if (!gadgets.isEnabled && step.type === BlockType.EVENT) return false;
          if (!chatCardsCarousel.isEnabled && step.type === BlockType.CAROUSEL) return false;
          if (isDialogflowPlatform(platform) && !dfCarousel.isEnabled && step.type === BlockType.CAROUSEL) return false;
          if (!(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) && step.type === BlockType.COMPONENT) return false;
          if (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion && step.type === BlockType.FLOW) return false;
          if (!newEditors2.isEnabled && step.type === BlockType.RANDOMV2) return false;
          if (newEditors2.isEnabled && step.type === BlockType.RANDOM) return false;
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
    [gadgets.isEnabled, topicsAndComponents.isEnabled, topicsAndComponents.isEnabled, isTopicsAndComponentsVersion]
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
