import { shallow } from 'enzyme';
import React from 'react';

import PlusIcon from '@/svgs/plus.svg';

import PrimaryButton from '..';

let component;

describe('Primary Button', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders', () => {
    component = shallow(<PrimaryButton>Button</PrimaryButton>);
  });

  it('renders with icon', () => {
    component = shallow(<PrimaryButton icon={PlusIcon}>Button</PrimaryButton>);
  });
});
