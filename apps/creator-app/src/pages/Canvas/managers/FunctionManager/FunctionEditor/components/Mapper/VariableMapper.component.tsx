import { Box, FocusIndicator, Mapper } from '@voiceflow/ui-next';
import React from 'react';

import { focusModifier, mapperModifier } from '../../Function.css';
import { ItemWithDescriptionTooltip } from './ItemWithDescriptionTooltip.component';

interface IVariableMapper {
  rightHandInput: React.ReactNode;
  leftHandInput: React.ReactNode;
  description?: string;
  isError?: boolean;
}

export const VariableMapper: React.FC<IVariableMapper> = ({ leftHandInput, rightHandInput, description, isError }) => {
  return (
    <Box height="36px" align="center">
      <FocusIndicator.Container pl={24} error={isError} className={focusModifier}>
        <Mapper
          equalityIcon="arrow"
          leftHandSide={<ItemWithDescriptionTooltip description={description}>{leftHandInput}</ItemWithDescriptionTooltip>}
          rightHandSide={<ItemWithDescriptionTooltip description={description}>{rightHandInput}</ItemWithDescriptionTooltip>}
          className={mapperModifier}
        />
      </FocusIndicator.Container>
    </Box>
  );
};
