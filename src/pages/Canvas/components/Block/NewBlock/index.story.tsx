import { select } from '@storybook/addon-knobs';
import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { Icon } from '@/components/SvgIcon';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { styled } from '@/hocs';

import NewBlock from '.';

const MockStep = styled(FlexCenter)`
  height: 54px;
  background-color: #fff;
`;

const MOCK_STEPS = (
  <>
    <MockStep>Step 1</MockStep>
    <MockStep>Step 2</MockStep>
    <MockStep>Step 3</MockStep>
    <MockStep>Step 4</MockStep>
    <MockStep>Step 5</MockStep>
  </>
);

const MOCK_STEPS_SHORT = (
  <>
    <MockStep>Step 1</MockStep>
    <MockStep>Step 2</MockStep>
  </>
);

const getProps = (blockName = 'New Block') => {
  const [name, setName] = React.useState(blockName);
  return {
    updateName: setName,
    name,
    children: MOCK_STEPS,
  };
};

const getMultiSectionProps = () => ({
  sections: [
    {
      name: 'Section1',
      icon: 'home' as Icon,
      children: MOCK_STEPS_SHORT,
    },
    {
      icon: 'home' as Icon,
      name: 'Section2 Blah blah blah blah blah',
      children: MOCK_STEPS_SHORT,
    },
  ],
});

export default {
  title: 'Creator/New Block',
  component: NewBlock,
};

export const standard = () => <NewBlock {...getProps()} />;

export const blue = () => <NewBlock variant={BlockVariant.BLUE} {...getProps()} />;

export const red = () => <NewBlock variant={BlockVariant.RED} {...getProps()} />;

export const green = () => <NewBlock variant={BlockVariant.GREEN} {...getProps()} />;

export const purple = () => <NewBlock variant={BlockVariant.PURPLE} {...getProps()} />;

export const longName = () => <NewBlock {...getProps()} />;

export const regularState = () => <NewBlock {...getProps()} />;

export const activeState = () => <NewBlock state={BlockState.ACTIVE} {...getProps()} />;

export const selectedState = () => <NewBlock state={BlockState.SELECTED} {...getProps()} />;

export const disabledState = () => <NewBlock state={BlockState.DISABLED} {...getProps()} />;

export const subSections = () => <NewBlock {...getProps()} {...getMultiSectionProps()} />;

export const stateTransitions = () => {
  const activeState = select(
    'Active State',
    {
      Regular: BlockState.REGULAR,
      Active: BlockState.ACTIVE,
      Selected: BlockState.SELECTED,
      Disabled: BlockState.DISABLED,
    },
    BlockState.REGULAR
  );

  return <NewBlock name="New Block 1" state={activeState} {...getProps()} />;
};
