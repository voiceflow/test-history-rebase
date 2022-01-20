import { transformStringVariableToNumber } from '@voiceflow/common';
import { Input } from '@voiceflow/ui';
import React from 'react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import Section, { SectionVariant } from '@/components/Section';
import { VariableTagTooltipStyles } from '@/components/VariableTag';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { Drawer } from '../PrototypeContainer';
import { InputPrefix, Variables } from './components';

const PrototypeVariableSettings: React.FC = () => {
  const variables = useSelector(Prototype.prototypeVariablesSelector);
  const updateVariables = useDispatch(Prototype.updateVariables);

  return (
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
};

export default PrototypeVariableSettings;
