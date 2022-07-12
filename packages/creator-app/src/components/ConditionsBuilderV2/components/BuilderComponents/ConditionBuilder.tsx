import { BaseNode } from '@voiceflow/base-types';
import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { LogicUnitDataType } from '../../../ConditionsBuilder/types';
import BuilderButton from './BuilderButton';
import BuilderContainer from './BuilderContainer';
import BuilderSelect from './BuilderSelect';

interface ConditionBuilderProps {
  expression?: LogicUnitDataType;
  onDelete: () => void;
  onAddComponent: (value: BaseNode.Utils.ConditionsLogicInterface) => void;
  onChange: (value: LogicUnitDataType) => void;
  hasAddButton?: boolean;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ expression, onDelete, onAddComponent, onChange, hasAddButton = false }) => {
  return (
    <Box.Flex>
      <BuilderContainer onClick={() => expression && onChange(expression)}>
        {expression && expression.value[0]?.value} {expression && expression.type} {expression && expression.value[1]?.value}
      </BuilderContainer>
      <BuilderButton onClick={onDelete} onKeyDown={onDelete} role="button" tabIndex={0}>
        <SvgIcon icon="minus" size={16} color="#6e849a" />
      </BuilderButton>
      {hasAddButton && <BuilderSelect onAddComponent={onAddComponent} />}
    </Box.Flex>
  );
};

export default ConditionBuilder;
