import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import { Flows } from '../Flows';

const diagrams1 = [
  {
    id: '1',
    name: 'ROOT',
    sub_diagrams: [],
  },
];

const diagrams2 = [
  {
    id: '1',
    name: 'ROOT',
    sub_diagrams: ['2'],
  },
  {
    id: '2',
    name: 'TEST',
    sub_diagrams: [],
  },
];

const visited = new Set();
describe('SideBar Project', () => {
  it('render flows sidebar with root', () => {
    const component = shallow(<Flows diagrams={diagrams1} visited={visited} />);
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
  it('render flows with sub diagrams', () => {
    const component = shallow(<Flows diagrams={diagrams2} visited={visited} />);
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });
});
