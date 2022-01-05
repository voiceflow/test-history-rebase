import { transformStringVariableToNumber } from '@voiceflow/common';
import { Input } from '@voiceflow/ui';
import React from 'react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import Section, { SectionVariant } from '@/components/Section';
import { VariableTagTooltipStyles } from '@/components/VariableTag';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Drawer } from '../PrototypeContainer';
import { InputPrefix, Variables } from './components';

const PrototypeVariableSettings: React.FC<ConnectedPrototypeVariableSettingsProps> = ({ variables, updateVariables }) => (
  <Drawer id={Identifier.PROTO_VARIABLES_MENU_CONTAINER}>
    <Section header="VARIABLES" borderBottom variant={SectionVariant.PROTOTYPE} />

    <Variables>
      {Object.keys(variables).map((name) => (
        <Input
          key={name}
          leftAction={
            <OverflowTippyTooltip delay={500} title={name} position="top-end" style={{ display: 'flex', maxWidth: '75%' }}>
              {(ref, { isOverflow }) => (
                <>
                  <InputPrefix ref={ref}>{name}</InputPrefix>
                  {isOverflow && <VariableTagTooltipStyles />}
                </>
              )}
            </OverflowTippyTooltip>
          }
          value={variables[name]}
          onBlur={() => updateVariables({ [name]: transformStringVariableToNumber(variables[name]) })}
          onChangeText={(value) => updateVariables({ [name]: value })}
          placeholder="Enter value"
        />
      ))}
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
