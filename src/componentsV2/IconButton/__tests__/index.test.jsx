import { shallow } from 'enzyme';
import React from 'react';

import IconButton from '..';

let component;

describe('Icon Button', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders', () => {
    component = shallow(<IconButton icon="plus" />);
  });
});
