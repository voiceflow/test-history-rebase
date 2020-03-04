import { select } from '@storybook/addon-knobs';
import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { Icon } from '@/components/SvgIcon';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { styled } from '@/hocs';

import NewBlock, { SectionsVariant } from '.';

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

const getProps = () => ({
  children: MOCK_STEPS,
});

const getMultiSectionProps = () => ({
  sections: [
    {
      name: 'Section 1',
      icon: 'home' as Icon,
      children: MOCK_STEPS_SHORT,
    },
    {
      icon: 'home' as Icon,
      name: 'Section 2 blah blah blah blah blah blah blah blah',
      children: MOCK_STEPS_SHORT,
    },
  ],
});

export default {
  title: 'Creator/New Block',
  component: NewBlock,
};

export const standard = () => <NewBlock name="New Block 1" {...getProps()} />;

export const blue = () => <NewBlock name="New Block 1" variant={BlockVariant.BLUE} {...getProps()} />;

export const red = () => <NewBlock name="New Block 1" variant={BlockVariant.RED} {...getProps()} />;

export const green = () => <NewBlock name="New Block 1" variant={BlockVariant.GREEN} {...getProps()} />;

export const purple = () => <NewBlock name="New Block 1" variant={BlockVariant.PURLPLE} {...getProps()} />;

export const longName = () => <NewBlock name="Block with a veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long name" {...getProps()} />;

export const regularState = () => <NewBlock name="New Block 1" {...getProps()} />;

export const activeState = () => <NewBlock name="New Block 1" state={BlockState.ACTIVE} {...getProps()} />;

export const selectedState = () => <NewBlock name="New Block 1" state={BlockState.SELECTED} {...getProps()} />;

export const disabledState = () => <NewBlock name="New Block 1" state={BlockState.DISABLED} {...getProps()} />;

export const subSections = () => <NewBlock sectionsVariant={SectionsVariant.MULTI_SECTION} {...getMultiSectionProps()} />;

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
