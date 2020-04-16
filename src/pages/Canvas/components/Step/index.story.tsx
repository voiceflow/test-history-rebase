import React from 'react';

import { withStepContext } from '@/../.storybook';
import { StepLabelVariant } from '@/constants/canvas';

import Block from '../Block';
import Step, { BaseStepProps, ElseItem, FailureItem, Item, ItemProps, Section, SuccessItem } from '.';

const getProps = () => ({
  label: 'Step',
  portID: 'port-ID',
});

export default {
  title: 'Creator/Step',
  component: Step,
};

const render = (props?: Partial<ItemProps> & Partial<BaseStepProps>) => () => (
  <Block name="Block">
    <Step image={props?.image}>
      <Section>
        <Item {...getProps()} {...props} />
      </Section>
    </Step>
  </Block>
);

export const primary = withStepContext()(render({ label: 'Primary Step' }));
export const secondary = withStepContext()(render({ label: 'Secondary Step', labelVariant: StepLabelVariant.PRIMARY }));
export const withPlaceholder = withStepContext()(
  render({ label: null, labelVariant: StepLabelVariant.PLACEHOLDER, placeholder: 'This step has a placeholder' })
);
export const withIcon = withStepContext()(render({ label: 'Step With Icon', icon: 'code', iconColor: 'red' }));
export const withoutPort = withStepContext()(render({ label: 'Step without port', portID: null }));
export const withLongLabel = withStepContext()(render({ label: 'Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation.' }));
export const withLongLabelAndNoPort = withStepContext()(
  render({ label: 'Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation.', portID: null })
);
export const active = withStepContext({ isActive: true })(render());
export const withConnectedPort = withStepContext({ isConnected: true })(render());
export const withImage = withStepContext()(render({ image: 'https://picsum.photos/seed/picsum/200/300' }));
export const withUserLock = withStepContext({ lockOwner: true })(render());

export const withMultipleSections = withStepContext({ isConnected: true })(() => (
  <Block name="Block">
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
  </Block>
));

export const withElse = withStepContext()(() => (
  <Block name="Block">
    <Step>
      <Section>
        <Item icon="code" iconColor="red" {...getProps()} />
      </Section>
      <ElseItem />
    </Step>
  </Block>
));

export const withSuccessFail = withStepContext()(() => (
  <Block name="Block">
    <Step>
      <Section>
        <Item {...getProps()} />
      </Section>
      <Section>
        <FailureItem {...getProps()} />
        <SuccessItem {...getProps()} />
      </Section>
    </Step>
  </Block>
));

export const withCustomSuccessFail = withStepContext({ isConnected: true })(() => (
  <Block name="Block">
    <Step>
      <Section>
        <Item {...getProps()} />
      </Section>
      <Section>
        <FailureItem label="Declined" {...getProps()} />
        <SuccessItem label="Successfully Cancelled" {...getProps()} />
      </Section>
    </Step>
  </Block>
));
