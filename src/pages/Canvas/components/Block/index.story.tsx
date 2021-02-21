import { select } from '@storybook/addon-knobs';
import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { Icon } from '@/components/SvgIcon';
import { BlockVariant } from '@/constants/canvas';
import { styled } from '@/hocs';
import Step from '@/pages/Canvas/components/Step';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { NODE_DISABLED_CLASSNAME, NODE_FOCUSED_CLASSNAME, NODE_SELECTED_CLASSNAME } from '@/pages/Canvas/constants';
import { StepAPI } from '@/pages/Canvas/types';
import { identity } from '@/utils/functional';

import Block, { BlockProps } from '.';

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
  created: '',
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
    <StepAPIProvider value={{ wrapElement: identity } as StepAPI}>
      <Step nodeID="foo">Order Pizza</Step>
    </StepAPIProvider>
    <StepAPIProvider value={{ lockOwner: getUserProps(), wrapElement: identity } as any}>
      <Step nodeID="bar">New Order</Step>
    </StepAPIProvider>
  </>
);

const getMultiStepProps = (): Partial<BlockProps> => ({
  sections: [
    {
      name: 'Section 1',
      icon: 'home',
      children: MOCK_STEPS_SHORT,
    },
    {
      name: 'Block 1',
      children: MOCK_STEPS_LOCKED,
    },
  ],
});

export default {
  title: 'Creator/Block',
  component: Block,
};

export const standard = () => <Block {...getProps()} />;

export const blue = () => <Block variant={BlockVariant.BLUE} {...getProps()} />;

export const red = () => <Block variant={BlockVariant.RED} {...getProps()} />;

export const green = () => <Block variant={BlockVariant.GREEN} {...getProps()} />;

export const purple = () => <Block variant={BlockVariant.PURPLE} {...getProps()} />;

export const longName = () => <Block {...getProps()} />;

export const regularState = () => <Block {...getProps()} />;

export const focusedState = () => (
  <div className={NODE_FOCUSED_CLASSNAME}>
    <Block {...getProps()} />
  </div>
);

export const selectedState = () => (
  <div className={NODE_SELECTED_CLASSNAME}>
    <Block {...getProps()} />
  </div>
);

export const disabledState = () => (
  <div className={NODE_DISABLED_CLASSNAME}>
    <Block {...getProps()} />
  </div>
);

export const subSections = () => <Block {...getProps()} {...getMultiSectionProps()} />;

export const stateTransitions = () => {
  const activeClassname = select(
    'Active State',
    {
      Regular: '',
      Focused: NODE_FOCUSED_CLASSNAME,
      Selected: NODE_SELECTED_CLASSNAME,
      Disabled: NODE_DISABLED_CLASSNAME,
    },
    ''
  );

  return (
    <div className={activeClassname}>
      <Block {...getProps()} />
    </div>
  );
};

export const blockUserLock = () => (
  <div style={{ padding: '50px' }}>
    <Block {...getMultiSectionProps()} lockOwner={getUserProps()} {...getProps()} />
  </div>
);

export const stepUserLock = () => (
  <div style={{ padding: '50px' }}>
    <Block {...getMultiStepProps()} {...getProps()} />
  </div>
);
