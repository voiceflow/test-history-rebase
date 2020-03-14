import { select } from '@storybook/addon-knobs';
import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { Icon } from '@/components/SvgIcon';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { styled } from '@/hocs';
import Step from '@/pages/Canvas/components/Step';

import NewBlock, { NewBlockProps } from '.';

const MockStep = styled(FlexCenter)`
  height: 54px;
  background-color: #fff;
`;

const getUserProps = () => ({
  name: 'Mike',
  email: 'mike@test.com',
  role: 'editor',
  image: 'E760D4|FCEFFB',
  creator_id: 4,
  seats: 1,
  created: null,
  color: '36B4D2|ECF8FA',
});

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

const MOCK_STEPS_LOCKED = (
  <>
    <Step>Order Pizza</Step>
    <Step lockOwner={getUserProps()}>New Order</Step>
  </>
);

const getMultiStepProps = (): Partial<NewBlockProps> => ({
  sections: [
    {
      name: 'Section 1',
      icon: 'home',
      children: MOCK_STEPS_SHORT,
    },
    {
      name: 'New Block 1',
      children: MOCK_STEPS_LOCKED,
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

export const blockUserLock = () => (
  <div style={{ padding: '50px' }}>
    <NewBlock {...getMultiSectionProps()} lockOwner={getUserProps()} {...getProps()} />
  </div>
);

export const stepUserLock = () => (
  <div style={{ padding: '50px' }}>
    <NewBlock {...getMultiStepProps()} {...getProps()} />
  </div>
);
