import React from 'react';

import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import Tooltip from '@/components/TippyTooltip';
import { VariableTag } from '@/components/VariableTag';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { Drawer } from '../PrototypeContainer';
import { Variables } from './components';

const PrototypeVariableSettings: React.FC<ConnectedPrototypeVariableSettingsProps> = ({ variables, updateVariables }) => (
  <Drawer>
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
  </Drawer>
);

const mapStateToProps = {
  variables: Prototype.prototypeVariablesSelector,
};

const mapDispatchToProps = {
  updateVariables: Prototype.updateVariables,
};

type ConnectedPrototypeVariableSettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeVariableSettings) as React.FC;
