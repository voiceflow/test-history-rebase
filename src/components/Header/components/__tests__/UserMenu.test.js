import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { UserMenu } from '../UserMenu';

describe('User Menu', () => {
  it('render user menu', () => {
    const component = shallow(<UserMenu user={{ creator_id: '123' }} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
