import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import { StepLabelVariant } from '@/constants/canvas';

import NewBlock from '../Block/NewBlock';
import Step, { BaseStepProps, ElseItem, FailureItem, Item, ItemProps, Section, SuccessItem } from '.';

const getProps = () => {
  return {
    label: 'Step',
    portID: 'port-ID',
  };
};

export default {
  title: 'Creator/Step',
  component: Step,
};

const render = (props?: Partial<ItemProps> & Partial<BaseStepProps>) => () => (
  <NewBlock name="Block">
    <Step isActive={props?.isActive} image={props?.image} lockOwner={props?.lockOwner}>
      <Section>
        <Item {...getProps()} {...props} />
      </Section>
    </Step>
  </NewBlock>
);

export const primary = withStepDispatcher()(render({ label: 'Primary Step' }));
export const secondary = withStepDispatcher()(render({ label: 'Secondary Step', labelVariant: StepLabelVariant.PRIMARY }));
export const withPlaceholder = withStepDispatcher()(
  render({ label: null, labelVariant: StepLabelVariant.PLACEHOLDER, placeholder: 'This step has a placeholder' })
);
export const withIcon = withStepDispatcher()(render({ label: 'Step With Icon', icon: 'code', iconColor: 'red' }));
export const withoutPort = withStepDispatcher()(render({ label: 'Step without port', portID: null }));
export const withLongLabel = withStepDispatcher()(render({ label: 'Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation.' }));
export const withLongLabelAndNoPort = withStepDispatcher()(
  render({ label: 'Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation.', portID: null })
);
export const active = withStepDispatcher()(render({ isActive: true }));
export const withConnectedPort = withStepDispatcher({ hasActiveLinks: true })(render());
export const withImage = withStepDispatcher()(render({ image: 'https://picsum.photos/seed/picsum/200/300' }));
export const withUserLock = withStepDispatcher({ lockOwner: true })(render());

export const withMultipleSections = withStepDispatcher({ hasActiveLinks: true })(() => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item icon="code" iconColor="red" {...getProps()} />
      </Section>
      <Section>
        <Item {...getProps()} />
        <Item {...getProps()} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
      </Section>
      <Section>
        <Item {...getProps()} />
      </Section>
    </Step>
  </NewBlock>
));

export const withElse = withStepDispatcher()(() => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item icon="code" iconColor="red" {...getProps()} />
      </Section>
      <ElseItem />
    </Step>
  </NewBlock>
));

export const withSuccessFail = withStepDispatcher()(() => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item {...getProps()} />
      </Section>
      <Section>
        <FailureItem {...getProps()} />
        <SuccessItem {...getProps()} />
      </Section>
    </Step>
  </NewBlock>
));

export const withCustomSuccessFail = withStepDispatcher({ hasActiveLinks: true })(() => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item {...getProps()} />
      </Section>
      <Section>
        <FailureItem label="Declined" {...getProps()} />
        <SuccessItem label="Successfully Cancelled" {...getProps()} />
      </Section>
    </Step>
  </NewBlock>
));
