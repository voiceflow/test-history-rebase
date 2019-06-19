import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import HelpModal from '../HelpModal';

describe('HelpModal', () => {
  it('render help modal', () => {
    const component = shallow(<HelpModal />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
