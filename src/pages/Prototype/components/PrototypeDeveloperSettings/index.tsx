import React from 'react';

import { Box } from '@/components/Box';
import Input from '@/components/Input';
import Section, { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import Tooltip from '@/components/TippyTooltip';
import { VariableTag } from '@/components/VariableTag';
import * as Prototype from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { Container, Variables } from './components';

const PrototypeDeveloperSettings: React.FC<ConnectedPrototypeDeveloperSettingsProps> = ({ settings, variables, updateSettings, updateVariables }) => (
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
                <Tooltip
                  delay={500}
                  distance={6}
                  html={
                    <Box style={{ wordWrap: 'break-word' }} maxWidth={550} textAlign="left">
                      {name}
                    </Box>
                  }
                  position="top"
                  popperOptions={{
                    modifiers: {
                      preventOverflow: {
                        // Popper v1.x - Default behaviour has overflow leftward, we want to make overflow rightward
                        // https://popper.js.org/docs/v1/#preventoverflowpriority
                        priority: ['right', 'left', 'top', 'bottom'],
                      },
                    },
                  }}
                >
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
);

const mapStateToProps = {
  settings: Recent.recentPrototypeSelector,
  variables: Prototype.prototypeVariablesSelector,
};

const mapDispatchToProps = {
  updateSettings: Recent.updateRecentPrototype,
  updateVariables: Prototype.updateVariables,
};

type ConnectedPrototypeDeveloperSettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeDeveloperSettings) as React.FC;
