import { shallow } from 'enzyme';
import React from 'react';

import SecondaryButton from '..';

let component;

describe('Seconday Button', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders', () => {
    component = shallow(<SecondaryButton>Button</SecondaryButton>);
  });

  it('renders with icon', () => {
    component = shallow(<SecondaryButton icon="plus">Button</SecondaryButton>);
  });
});
