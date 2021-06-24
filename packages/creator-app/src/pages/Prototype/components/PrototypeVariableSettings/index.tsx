import { transformStringVariableToNumber } from '@voiceflow/common';
import { Input, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { VariableTag } from '@/components/VariableTag';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Drawer } from '../PrototypeContainer';
import { Variables } from './components';

const PrototypeVariableSettings: React.FC<ConnectedPrototypeVariableSettingsProps> = ({ variables, updateVariables }) => (
  <Drawer id={Identifier.PROTO_VARIABLES_MENU_CONTAINER}>
    <Section header="VARIABLES" borderBottom variant={SectionVariant.PROTOTYPE} />

    <Variables>
      {Object.keys(variables).map((name) => {
        const value = variables[name];
        return (
          <Input
            key={name}
            leftAction={
              <VariableTag isPrototypeSettings style={{ maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <TippyTooltip delay={500} distance={6} title={name} position="top">
                  {name}
                </TippyTooltip>
              </VariableTag>
            }
            value={value}
            onChange={({ target: { value } }) => updateVariables({ [name]: value })}
            onBlur={() => updateVariables({ [name]: transformStringVariableToNumber(value) })}
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
