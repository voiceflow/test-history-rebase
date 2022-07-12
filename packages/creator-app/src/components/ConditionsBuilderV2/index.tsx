import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Popper, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { StyledProps } from 'styled-components';

import { ConditionsPopper, SidebarContainer } from './components';

export interface ConditionsBuilderV2Props extends StyledProps<any> {
  expression?: Realtime.ExpressionData;
  onChange: (value: Realtime.ExpressionData) => void;
}

const ConditionsBuilderV2: React.FC<ConditionsBuilderV2Props> = ({ expression, onChange }) => {
  return (
    <Box pt={16} pb={16}>
      <Popper placement="left-start" renderContent={() => <ConditionsPopper expression={expression} onChange={onChange} />}>
        {({ ref, onToggle }) => (
          <SidebarContainer ref={ref} onClick={onToggle}>
            <SvgIcon icon="ifV2" size={16} />
            <div style={{ paddingLeft: '12px' }}>{expression?.value?.length ? 'expression' : 'Empty Condition'}</div>
          </SidebarContainer>
        )}
      </Popper>
    </Box>
  );
};

export default ConditionsBuilderV2;
