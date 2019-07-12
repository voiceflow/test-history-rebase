import { shallow } from 'enzyme';
import React from 'react';

import PlusIcon from '@/svgs/plus.svg';

import IconButton from '..';

let component;

describe('Icon Button', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders', () => {
    component = shallow(<IconButton icon={PlusIcon} />);
  });
});
