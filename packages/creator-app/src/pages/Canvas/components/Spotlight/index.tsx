import { KeyName, preventDefault, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import ReactSelect from 'react-select';

import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { useFeature, useTrackingEvents } from '@/hooks';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { getSections, MenuStep } from '@/pages/Skill/components/DesignMenu/components/Steps/constants';
import { PlatformContext } from '@/pages/Skill/contexts';
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
