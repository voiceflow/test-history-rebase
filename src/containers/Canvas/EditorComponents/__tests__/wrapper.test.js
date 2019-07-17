import { shallow } from 'enzyme/build';
import _ from 'lodash';
import React from 'react';

import EditorWrapper from '../wrapper';

describe('EditorWrapper', () => {
  const diagramEngine = {
    getDiagramModel: () => {
      _.noop();
    },
  };

  it('render', () => {
    const component = shallow(
      <EditorWrapper unfocus={_.noop()} setCanvasEvents={_.noop()} diagramEngine={diagramEngine} undo={_.noop()} redo={_.noop()} />
    );

    expect(component).toMatchSnapshot();
  });
});
