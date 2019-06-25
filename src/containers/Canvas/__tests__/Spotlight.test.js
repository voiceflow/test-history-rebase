import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Spotlight } from '../Spotlight';

describe('Spotlight', () => {
  it('render spotlight', () => {
    global.user_detail = {
      admin: 100,
      email: 'jason@getvoiceflow.com',
      first_login: false,
      iat: 1550192538,
      id: 18,
      name: 'Jason Zhao',
      verified: null,
    };
    const component = shallow(<Spotlight />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
