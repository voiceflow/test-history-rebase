import { Utils } from '@voiceflow/common';
import { Flex, KeyName, preventDefault, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { SelectInstance } from 'react-select';

import { useCanvasNodeFilter } from '@/hooks/canvasNodes';
import { useActiveProjectConfig } from '@/hooks/platformConfig';
import { useTrackingEvents } from '@/hooks/tracking';
import { EngineContext, SpotlightContext } from '@/pages/Canvas/contexts';
import { useManager } from '@/pages/Canvas/managers/utils';
import { getStepSections, StepItem } from '@/pages/Project/components/StepMenu/constants';
import { Identifier } from '@/styles/constants';
import { withKeyPress } from '@/utils/dom';

import { Container, Control, Menu, searchSelectFactory } from '../Search/components';

interface Option extends StepItem {
  value: string;
  label: React.ReactNode;
}

const Select = searchSelectFactory<Option>();

const Spotlight = () => {
  const engine = React.useContext(EngineContext)!;
  const { platform, projectType } = useActiveProjectConfig();
  // NOTE: extra protection against context being falsy needed for HMR
  const spotlight = React.useContext(SpotlightContext);

  const selectRef = React.useRef<SelectInstance<Option, false>>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [trackingEvents] = useTrackingEvents();
  const getManager = useManager();

  const isVisible = !!spotlight?.isVisible;

  const onChange = async (step: StepItem | null) => {
    if (!step) return;

    await engine.node.add({ type: step.type, coords: engine.getMouseCoords(), factoryData: step.factoryData });

    spotlight?.hide();
  };

  const nodeFilter = useCanvasNodeFilter();

  const options = React.useMemo(
    () =>
      getStepSections(platform, projectType)
        .flatMap((section) => Utils.array.inferUnion(section.steps))
        .filter((step) => Utils.object.hasProperty(step, 'type') && nodeFilter(step))
        .map<Option>((step) => {
          const manager = getManager(step.type);
          const value = step.getLabel(manager) || '';

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
    [platform, nodeFilter]
  );

  const trimmedValue = inputValue.toLowerCase().trim();

  const filteredOptions = React.useMemo(
    () =>
      options
        .filter(({ value }) => value.toLowerCase().includes(trimmedValue))
        .sort(
          (leftOption, rightOption) =>
            leftOption.value.toLowerCase().indexOf(trimmedValue) - rightOption.value.toLowerCase().indexOf(trimmedValue)
        ),
    [options, trimmedValue]
  );

  useDidUpdateEffect(() => {
    if (isVisible) {
      trackingEvents.trackCanvasSpotlightOpened();
    }
  }, [isVisible]);

  React.useLayoutEffect(() => {
    selectRef.current?.focusOption('first');
  }, [inputValue]);

  if (!isVisible) {
    return null;
  }

  return (
    <Container id={Identifier.SPOTLIGHT} onClick={preventDefault()}>
      <Select
        ref={selectRef}
        value={null}
        onBlur={() => spotlight?.hide()}
        options={filteredOptions}
        onChange={onChange}
        inputValue={inputValue}
        components={{ Menu, Control, IndicatorsContainer: () => null }}
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
