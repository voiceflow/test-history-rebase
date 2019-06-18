import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import Payment from '../Payment';

describe('PaymentEditor', () => {
  it('render payment block editor', () => {
    const component = shallow(<Payment />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
