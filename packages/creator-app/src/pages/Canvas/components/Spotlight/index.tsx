import { KeyName, preventDefault, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import ReactSelect from 'react-select';

import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { getSections, MenuStep } from '@/pages/Project/components/DesignMenu/components/Steps/constants';
import { PlatformContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';
import { withKeyPress } from '@/utils/dom';

import { Container, Select } from './components';

const Spotlight = () => {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  // NOTE: extra protection against context being falsy needed for HMR
  const spotlight = React.useContext(SpotlightContext);

  const selectRef = React.useRef<ReactSelect>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [trackingEvents] = useTrackingEvents();
  const gadgets = useFeature(FeatureFlag.GADGETS);
  const captureV2 = useFeature(FeatureFlag.CAPTURE_V2);
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const isVisible = !!spotlight?.isVisible;

  const onChange = async (step: MenuStep) => {
    await engine.node.add(step.type, engine.getMouseCoords(), step.factoryData);

    spotlight?.hide();
  };

  const options = React.useMemo(
    () =>
      getSections(platform)
        .flatMap((section) => section.steps)
        .filter((step) => {
          if (!gadgets.isEnabled && step.type === BlockType.EVENT) return false;
          if (captureV2.isEnabled) {
            if (step.type === BlockType.CAPTURE) return false;
            if (step.type === BlockType.CAPTUREV2) return true;
          }
          if (!(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) && step.type === BlockType.COMPONENT) return false;
          if (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion && step.type === BlockType.FLOW) return false;
          if (IS_PRIVATE_CLOUD && step.publicOnly) return false;
          return true;
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
    .filter(({ label }) => label.toLowerCase().includes(trimmedValue))
    .sort((leftOption, rightOption) => leftOption.label.toLowerCase().indexOf(trimmedValue) - rightOption.label.toLowerCase().indexOf(trimmedValue));

  return (
    <Container id={Identifier.SPOTLIGHT} onClick={preventDefault()}>
      <Select
        ref={selectRef}
        value={null}
        onBlur={spotlight?.hide}
        options={filteredOptions}
        onChange={onChange}
        inputValue={inputValue}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onKeyDown={withKeyPress(KeyName.ESCAPE, () => spotlight?.hide())}
        placeholder="Add Block"
        filterOption={() => true}
        onInputChange={setInputValue}
        maxMenuHeight={124}
        classNamePrefix="spotlight"
      />
    </Container>
  );
};

export default Spotlight;
