import cn from 'classnames';
import { defaultVariables } from 'containers/Canvas/Constants';
import { setDebug, updateGlobal } from 'ducks/test';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import Toggle from 'react-toggle';

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
            <div key={name} className="test-variable editor">
              <div className={cn('variable_tag', { default: isDefault })}>{name}</div>
              <input className="input-clear" value={value} onChange={(e) => updateGlobal(name, e.target.value)} placeholder="Variable Value" />
            </div>
          );
        })}
      </div>
      <div className="no-space__break" />
      <Tooltip title="Debug mode shows you the paths, variables, and flows you’re using as you’re testing your project" position="left">
        <div style={{ padding: '19px 20px' }} className="space-between pointer" onClick={() => setDebug(!debug)}>
          <span className="text-dull">Debug Mode</span>
          <Toggle checked={debug} icons={false} readOnly />
        </div>
      </Tooltip>
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
