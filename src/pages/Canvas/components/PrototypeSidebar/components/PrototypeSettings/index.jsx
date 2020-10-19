import React from 'react';

import Drawer from '@/components/Drawer';
import Input from '@/components/Input';
import Section, { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import Tooltip from '@/components/TippyTooltip';
import { VariableTag } from '@/components/VariableTag';
import { prototypeVariablesSelector, updateVariables } from '@/ducks/prototype';
import { recentprototypeSelector, updateRecentPrototype } from '@/ducks/recent';
import { connect } from '@/hocs';
import { PROTOTYPE_SIDEBAR_WIDTH, TESTING_SIDEBAR_SETTINGS_WIDTH } from '@/pages/Canvas/components/PrototypeSidebar/constants';

import Container from './components/PrototypeSettingsContainer';
import Variables from './components/PrototypeSettingsVariables';

const PrototypeSettings = ({ open, settings, updateSettings, variables, updateVariables }) => (
  <Drawer as="section" open={open} width={TESTING_SIDEBAR_SETTINGS_WIDTH} offset={PROTOTYPE_SIDEBAR_WIDTH} direction="left">
    <Container>
      <Section header="VARIABLES" borderBottom variant={SectionVariant.PROTOTYPE} />
      <Variables>
        {Object.keys(variables).map((name) => {
          const value = variables[name];
          // if (typeof value === 'object') return null;
          return (
            <Input
              key={name}
              leftAction={
                <VariableTag isPrototypeSettings={true} style={{ maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Tooltip delay={500} distance={6} title={name} position="top">
                    {name}
                  </Tooltip>
                </VariableTag>
              }
              value={value}
              onChange={(e) => updateVariables({ [name]: e.target.value })}
              placeholder="Enter value"
            />
          );
        })}
      </Variables>
      <UncontrolledSection
        header="Debug Mode"
        isCollapsed={!settings.debug}
        onClick={() => updateSettings({ debug: !settings.debug })}
        collapseVariant={SectionToggleVariant.TOGGLE}
        tooltip="Debug mode shows you the paths, variables, and flows you’re using as you’re testing your project"
      />
    </Container>
  </Drawer>
);

const mapStateToProps = {
  settings: recentprototypeSelector,
  variables: prototypeVariablesSelector,
};

const mapDispatchToProps = {
  updateSettings: updateRecentPrototype,
  updateVariables,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeSettings);
