import React from 'react';

import Drawer from '@/components/Drawer';
import Input from '@/components/Input';
import Section, { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import { VariableTag } from '@/components/VariableTag';
import { recentTestingSelector, updateRecentTesting } from '@/ducks/recent';
import { testingVariablesSelector, updateVariables } from '@/ducks/testingV2';
import { connect } from '@/hocs';
import { TESTING_SIDEBAR_SETTINGS_WIDTH, TESTING_SIDEBAR_WIDTH } from '@/pages/Canvas/components/TestingSidebar/constants';

import TestSettingsContainer from './components/TestSettingsContainer';
import TestSettingsVariables from './components/TestSettingsVariables';

const TestSettings = ({ open, settings, updateSettings, variables, updateVariables }) => (
  <Drawer as="section" open={open} width={TESTING_SIDEBAR_SETTINGS_WIDTH} offset={TESTING_SIDEBAR_WIDTH} direction="left">
    <TestSettingsContainer>
      <Section header="Variables" borderBottom />
      <TestSettingsVariables>
        {Object.keys(variables).map((name) => {
          const value = variables[name];
          // if (typeof value === 'object') return null;
          return (
            <Input
              key={name}
              leftAction={<VariableTag>{`{${name}}`}</VariableTag>}
              value={value}
              onChange={(e) => updateVariables({ [name]: e.target.value })}
              placeholder="Enter value"
            />
          );
        })}
      </TestSettingsVariables>
      <UncontrolledSection
        header="Debug Mode"
        isCollapsed={!settings.debug}
        onClick={() => updateSettings({ debug: !settings.debug })}
        collapseVariant={SectionToggleVariant.TOGGLE}
        tooltip="Debug mode shows you the paths, variables, and flows you’re using as you’re testing your project"
      />
    </TestSettingsContainer>
  </Drawer>
);

const mapStateToProps = {
  settings: recentTestingSelector,
  variables: testingVariablesSelector,
};

const mapDispatchToProps = {
  updateSettings: updateRecentTesting,
  updateVariables,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestSettings);
