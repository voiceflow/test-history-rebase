import { shallow } from 'enzyme/build';
import React from 'react';

import { IntercomChat } from '../IntercomChat';

describe('Intercom Chat', () => {
  it('render intercom chat', () => {
    const component = shallow(<IntercomChat user={{ creator_id: '123' }} />);
    expect(component).toMatchSnapshot();
  });
});
