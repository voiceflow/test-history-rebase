import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import _ from 'lodash';

import Toggle from 'react-toggle';

import { defaultVariables } from './../Sidebars/Variables';
import { setDebug, updateGlobal } from 'ducks/test';

function TestSettings(props) {
  const { open, debug, setDebug, globals, updateGlobal } = props;

  return (
    <div id="TestSettings" className={cn({ open })}>
      <div className="condition-label">
        <label>Variables</label>
      </div>
      <div className="no-space__break" />
      <div id="TestVariables">
        {Object.keys(globals).map((name) => {
          const value = globals[name];
          if (typeof value === 'object') return null;

          const isDefault = name in defaultVariables;

          return (
            <div key={name} className="test-variable">
              <div className={cn('variable_tag', { default: isDefault })}>{'{' + name + '}'}</div>
              <input className="input-clear" value={value} onChange={(e) => updateGlobal(name, e.target.value)} />
            </div>
          );
        })}
      </div>
      <div className="no-space__break" />
      <div style={{ padding: 20 }} className="py-5">
        <div className="space-between">
          <span className="text-dull">Debug Mode</span>
          <Toggle checked={debug} icons={false} onChange={() => setDebug(!debug)} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  debug: state.test.debug,
  globals: state.test.state.globals[0],
});

const mapDispatchToProps = {
  setDebug,
  updateGlobal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestSettings);
