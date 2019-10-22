import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import EmptyCard from '../EmptyCard';

describe('Empty Card Test', () => {
  it('render empty card', () => {
    const component = shallow(<EmptyCard />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
