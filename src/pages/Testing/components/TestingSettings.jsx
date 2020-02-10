import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';
import Toggle from 'react-toggle';

import { GlobalVariable } from '@/constants';
import { recentTestingSelector, updateRecentTesting } from '@/ducks/recent';
import { testGlobalsSelector, updateGlobal } from '@/ducks/test';
import { connect } from '@/hocs';

const TestSettings = ({ open, settings, updateSettings, globals, updateGlobal }) => (
  <div id="TestSettings" className={cn({ open })}>
    <div className="condition-label">
      <label className="mb-0">Variables</label>
    </div>
    <div className="no-space__break" />
    <div id="TestVariables">
      {Object.keys(globals).map((name) => {
        const value = globals[name];
        if (typeof value === 'object') return null;
        const isDefault = name in GlobalVariable;
        return (
          <div key={name} className="test-variable editor">
            <div className={cn('variable_tag', { default: isDefault })}>{name}</div>
            <input className="input-clear" value={value} onChange={(e) => updateGlobal(name, e.target.value)} placeholder="Enter value" />
          </div>
        );
      })}
    </div>
    <div className="no-space__break" />
    <Tooltip title="Debug mode shows you the paths, variables, and flows you’re using as you’re testing your project" position="left">
      <div style={{ padding: '18px 20px' }} className="space-between pointer" onClick={() => updateSettings({ debug: !settings.debug })}>
        <label className="mb-0">Debug Mode</label>
        <Toggle checked={settings.debug} icons={false} readOnly />
      </div>
    </Tooltip>
  </div>
);

const mapStateToProps = {
  settings: recentTestingSelector,
  globals: testGlobalsSelector,
};

const mapDispatchToProps = {
  updateSettings: updateRecentTesting,
  updateGlobal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestSettings);
