import { Box, FocusIndicator, Mapper } from '@voiceflow/ui-next';
import React from 'react';

import { focusModifier, mapperModifier } from '../../Function.css';
import { ItemWithDescriptionTooltip } from './ItemWithDescriptionTooltip.component';

interface IVariableMapper {
  isError?: boolean;
  description: string | null;
  leftHandInput: React.ReactNode;
  rightHandInput: React.ReactNode;
}

export const VariableMapper: React.FC<IVariableMapper> = ({ leftHandInput, rightHandInput, description, isError }) => {
  return (
    <Box height="36px" align="center">
      <FocusIndicator.Container pl={24} pr={16} error={isError} className={focusModifier}>
        <Mapper
          equalityIcon="arrow"
          leftHandSide={
            <ItemWithDescriptionTooltip
              description={description}
              modifiers={[{ name: 'offset', options: { offset: [-6, 28] } }]}
            >
              {leftHandInput}
            </ItemWithDescriptionTooltip>
          }
          rightHandSide={
            <ItemWithDescriptionTooltip
              description={description}
              modifiers={[{ name: 'offset', options: { offset: [-6, 12] } }]}
            >
              {rightHandInput}
            </ItemWithDescriptionTooltip>
          }
          className={mapperModifier}
        />
      </FocusIndicator.Container>
    </Box>
  );
};
