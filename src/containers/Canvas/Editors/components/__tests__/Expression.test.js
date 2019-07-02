import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Expression } from '../Expression';

describe('Expression', () => {
  it('render value expression', () => {
    const component = shallow(<Expression expression={{ type: 'value' }} />);

    expect(toJson(component)).toMatchSnapshot();
  });

  it('render variable expression', () => {
    const component = shallow(<Expression expression={{ type: 'variable' }} variables={[]} />);

    expect(toJson(component)).toMatchSnapshot();
  });

  it('render not expression', () => {
    const component = shallow(<Expression expression={{ type: 'not' }} />);

    expect(toJson(component)).toMatchSnapshot();
  });

  it('render other expression', () => {
    const component = shallow(<Expression expression={{ type: 'other', value: [] }} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
