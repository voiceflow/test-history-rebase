import React from 'react';
import { useTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import Input from '@/components/Input';
import Section, { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import Tooltip from '@/components/TippyTooltip';
import { VariableTag } from '@/components/VariableTag';
import { FeatureFlag } from '@/config/features';
import * as Prototype from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { Theme } from '@/styles/theme';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';

import { Container, Variables } from './components';

type PrototypeDeveloperSettingsProps = {
  open?: boolean;
};

const PrototypeDeveloperSettings: React.FC<PrototypeDeveloperSettingsProps & ConnectedPrototypeDeveloperSettingsProps> = ({
  settings,
  updateSettings,
  variables,
  updateVariables,
  open = false,
}) => {
  const theme = useTheme() as Theme;
  const visualPrototype = useFeature(FeatureFlag.VISUAL_PROTOTYPE);

  return (
    <Drawer
      as="section"
      open={open}
      width={theme.components[visualPrototype.isEnabled ? 'developerSettings' : 'prototypeSidebar'].width}
      offset={theme.components[visualPrototype.isEnabled ? 'subMenu' : 'prototypeSidebar'].width}
      direction={visualPrototype.isEnabled ? SlideOutDirection.RIGHT : SlideOutDirection.LEFT}
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
  settings: Recent.recentPrototypeSelector,
  variables: Prototype.prototypeVariablesSelector,
};

const mapDispatchToProps = {
  updateSettings: Recent.updateRecentPrototype,
  updateVariables: Prototype.updateVariables,
};

type ConnectedPrototypeDeveloperSettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeDeveloperSettings) as React.FC<PrototypeDeveloperSettingsProps>;
