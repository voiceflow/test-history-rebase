import { select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import { FlexCenter } from '@/componentsV2/Flex';
import { BlockState } from '@/constants/canvas';
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

storiesOf('New Block', module)
  .add(
    'variants',
    createTestableStory(() => {
      return (
        <>
          <Variant label="standard">
            <NewBlock name="New Block 1">{MOCK_STEPS}</NewBlock>
          </Variant>
          <Variant label="blue">
            <NewBlock name="New Block 1" variant="blue">
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
          <Variant label="red">
            <NewBlock name="New Block 1" variant="red">
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
          <Variant label="green">
            <NewBlock name="New Block 1" variant="green">
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
          <Variant label="purple">
            <NewBlock name="New Block 1" variant="purple">
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
          <Variant label="long name">
            <NewBlock name="Block with a veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long name">{MOCK_STEPS}</NewBlock>
          </Variant>
        </>
      );
    })
  )
  .add(
    'states',
    createTestableStory(() => {
      return (
        <>
          <Variant label={BlockState.REGULAR}>
            <NewBlock name="New Block 1">{MOCK_STEPS}</NewBlock>
          </Variant>
          <Variant label={BlockState.ACTIVE}>
            <NewBlock name="New Block 1" state={BlockState.ACTIVE}>
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
          <Variant label={BlockState.SELECTED}>
            <NewBlock name="New Block 1" state={BlockState.SELECTED}>
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
          <Variant label={BlockState.DISABLED}>
            <NewBlock name="New Block 1" state={BlockState.DISABLED}>
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
        </>
      );
    })
  )
  .add(
    'state transitions',
    createTestableStory(() => {
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

      return (
        <>
          <Variant label="state transitions">
            <NewBlock name="New Block 1" state={activeState}>
              {MOCK_STEPS}
            </NewBlock>
          </Variant>
        </>
      );
    })
  );
