import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import API from '../API';
import { defaultNode } from '../__mock__/defaultNode';

describe('API', () => {
  it('render api editor', () => {
    const node = defaultNode;
    node.name = 'API';
    node.extras = {
      body: [],
      bodyInputType: 'keyValue',
      content: '',
      failure_id: '',
      headers: [],
      mapping: [],
      method: 'GET',
      params: [],
      success_id: '',
      type: 'api',
      url: { blocks: [], entityMap: {} },
    };
    const variables = [];
    const component = shallow(<API node={node} variables={variables} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
