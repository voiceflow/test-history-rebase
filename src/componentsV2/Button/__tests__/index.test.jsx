import { shallow } from 'enzyme';
import React from 'react';

import Button from '..';

let component;

describe('Button', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders primary', () => {
    component = shallow(<Button>Primary Button</Button>);
  });

  it('renders secondary', () => {
    component = shallow(<Button variant="secondary">Secondary Button</Button>);
  });

  it('renders tertiary', () => {
    component = shallow(<Button variant="tertiary">Tertiary Button</Button>);
  });
});
