import { BaseNode } from '@voiceflow/base-types';
import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { LogicUnitDataType } from '../types';
import ConditionInput from './Input';
import BuilderSelect from './Select';
import * as S from './styles';

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
      <S.Container>{expression && <ConditionInput expression={expression as LogicUnitDataType} onChange={onChange} />}</S.Container>
      <S.BuilderButton onClick={onDelete} onKeyDown={onDelete} role="button" tabIndex={0}>
        <SvgIcon icon="minus" size={16} color="#6e849a" />
      </S.BuilderButton>
      {hasAddButton && <BuilderSelect onAddComponent={onAddComponent} />}
    </Box.Flex>
  );
};

export default ConditionBuilder;
