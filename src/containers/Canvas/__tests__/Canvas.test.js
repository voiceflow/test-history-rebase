import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import _ from 'lodash';
import React from 'react';

import { testSkill } from '../__mock__/MockSkill';
import { Canvas } from '../index.jsx';

const setOnSave = jest.fn();
const historyMock = { push: jest.fn() };
const error = jest.fn();

describe('Canvas', () => {
  it('render canvas', () => {
    const skill = testSkill;
    const component = shallow(
      <Canvas skill={skill} setOnSave={setOnSave} resetSkill={jest.fn()} getIntegrationsUsers={jest.fn(() => Promise.resolve())} />
    );
    expect(toJson(component)).toMatchSnapshot();
    component.unmount();
  });

  it('auto save test', () => {
    const skill = testSkill;
    const spy = jest.spyOn(Canvas.prototype, 'onSave');
    const unmount = jest.spyOn(Canvas.prototype, 'componentWillUnmount');
    const diagram_id = 'e9f52b0622f08ff1b21137bae05a242b';
    const component = shallow(
      <Canvas
        skill={skill}
        resetSkill={jest.fn()}
        diagram_id={diagram_id}
        onError={_.noop}
        updateSkill={_.noop}
        setOnSave={setOnSave}
        getIntegrationsUsers={jest.fn(() => Promise.resolve())}
      />
    );
    component.unmount();
    expect(unmount).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should enter flow 12345', () => {
    const skill = testSkill;
    const diagram_id = 'e9f52b0622f08ff1b21137bae05a242b';
    const enterFlow = jest.spyOn(Canvas.prototype, 'enterFlow');
    const component = shallow(
      <Canvas
        page="canvas"
        skill={skill}
        setOnSave={setOnSave}
        diagram_id={diagram_id}
        history={historyMock}
        updateSkill={jest.fn()}
        getIntegrationsUsers={jest.fn(() => Promise.resolve())}
      />
    );
    component.instance().enterFlow('12345', false);
    expect(enterFlow).toHaveBeenCalled();
    expect(historyMock.push.mock.calls[0]).toEqual(['/canvas/L8mr69wm4K/12345']);
  });

  it('should create a new flow error', () => {
    const skill = testSkill;
    const node = {
      extras: {
        diagram_id: '12345',
      },
    };
    const diagram_id = 'e9f52b0622f08ff1b21137bae05a242b';
    const enterFlow = jest.spyOn(Canvas.prototype, 'createDiagram');
    const component = shallow(
      <Canvas
        skill={skill}
        diagrams={[]}
        setOnSave={setOnSave}
        diagram_id={diagram_id}
        history={historyMock}
        setError={error}
        getIntegrationsUsers={jest.fn(() => Promise.resolve())}
      />
    );
    component.instance().createDiagram(node);
    expect(enterFlow).toHaveBeenCalled();
  });

  it('should save diagram error', () => {
    const skill = testSkill;
    const diagram_id = 'e9f52b0622f08ff1b21137bae05a242b';
    const onSave = jest.spyOn(Canvas.prototype, 'onSave');
    const component = shallow(
      <Canvas
        skill={skill}
        diagrams={[]}
        setOnSave={setOnSave}
        diagram_id={diagram_id}
        history={historyMock}
        updateSkill={jest.fn()}
        setError={error}
        updateDiagrams={_.noop}
        getIntegrationsUsers={jest.fn(() => Promise.resolve())}
      />
    );
    component.instance().onSave();
    expect(onSave).toHaveBeenCalled();
  });
});
