import React from 'react';

import Drawer from '@/components/Drawer';
import Input from '@/components/Input';
import Section, { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { SUBMENU_WIDTH } from '@/components/SubMenu/constants';
import Tooltip from '@/components/TippyTooltip';
import { VariableTag } from '@/components/VariableTag';
import { FeatureFlag } from '@/config/features';
import { prototypeVariablesSelector, updateVariables } from '@/ducks/prototype';
import { recentprototypeSelector, updateRecentPrototype } from '@/ducks/recent';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { PROTOTYPE_SIDEBAR_WIDTH } from '@/pages/Canvas/components/PrototypeSidebar/constants';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';

import { DEVELOPER_SECTION_WIDTH } from '../../constants';
import { Container, Variables } from './components';

type PrototypeDeveloperProps = {
  open?: boolean;
};

const PrototypeDeveloper: React.FC<PrototypeDeveloperProps & ConnectedPrototypeDeveloperProps> = ({
  settings,
  updateSettings,
  variables,
  updateVariables,
  open = false,
}) => {
  const prototypeTestEnabled = useFeature(FeatureFlag.PROTOTYPE_TEST).isEnabled;
  return (
    <Drawer
      as="section"
      open={open}
      width={prototypeTestEnabled ? DEVELOPER_SECTION_WIDTH : PROTOTYPE_SIDEBAR_WIDTH}
      offset={prototypeTestEnabled ? SUBMENU_WIDTH : PROTOTYPE_SIDEBAR_WIDTH}
      direction={prototypeTestEnabled ? SlideOutDirection.RIGHT : SlideOutDirection.LEFT}
    >
      <Container>
        <Section header="VARIABLES" borderBottom variant={SectionVariant.PROTOTYPE} />
        <Variables>
          {Object.keys(variables).map((name) => {
            const value = variables[name];
            return (
              <Input
                key={name}
                leftAction={
                  <VariableTag isPrototypeSettings style={{ maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
};

const mapStateToProps = {
  settings: recentprototypeSelector,
  variables: prototypeVariablesSelector,
};

const mapDispatchToProps = {
  updateSettings: updateRecentPrototype,
  updateVariables,
};

type ConnectedPrototypeDeveloperProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeDeveloper) as React.FC<PrototypeDeveloperProps>;
