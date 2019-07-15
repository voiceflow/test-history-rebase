import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import _ from 'lodash';
import React from 'react';

import ExpandedEditorView from '../wrapper';

describe('ExpandedEditorView', () => {
  it('render when open', () => {
    const component = shallow(<ExpandedEditorView updateState={_.noop()} isOpen={true} nodeName="node1" editorRender={_.noop()} />);

    expect(toJson(component)).toMatchSnapshot();
  });

  it('render when not open', () => {
    const component = shallow(<ExpandedEditorView updateState={_.noop()} isOpen={false} nodeName="node1" editorRender={_.noop()} />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
