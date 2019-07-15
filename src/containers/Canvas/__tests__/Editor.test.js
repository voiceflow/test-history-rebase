import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import _ from 'lodash';
import React from 'react';

import Editor from '../Editor';

describe('Editor', () => {
  it('render', () => {
    const component = shallow(
      <Editor.WrappedComponent
        variables={[]}
        redoEvents={[]}
        undoEvents={[]}
        locals={[]}
        diagrams={[]}
        global_variables={[]}
        unfocus={_.noop()}
        addRedo={_.noop()}
        addUndo={_.noop()}
        repaint={_.noop()}
        setHelp={_.noop()}
        onUpdate={_.noop()}
        copyNode={_.noop()}
        clearUndo={_.noop()}
        clearRedo={_.noop()}
        enterFlow={_.noop()}
        removeNode={_.noop()}
        removeUndo={_.noop()}
        updateLinter={_.noop()}
        setCanvasEvents={_.noop()}
        appendCombineNode={_.noop()}
        removeCombineNode={_.noop()}
        node={{}}
        history={{}}
        google_publish_info={{}}
        diagram_level_intents={{}}
        platform="mockString"
        open={true}
      />
    );

    expect(toJson(component)).toMatchSnapshot();
  });
});
