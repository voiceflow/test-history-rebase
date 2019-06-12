import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { Permissions } from '../Permissions';
import { defaultNode } from '../__mock__/defaultNode';

describe('PermissionsEditor', () => {
  it('render permissions block editor', () => {
    const node = defaultNode;
    node.name = 'Permissions';
    node.extras = {
      permissions: [],
      type: 'permission',
    };
    const component = shallow(<Permissions node={node} />);
    expect(component.state().node).toEqual(node);
    expect(toJson(component)).toMatchSnapshot();
  });
});
