import { BaseNode } from '@voiceflow/base-types';
import { Dropdown, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { TreeLogicExpressions } from '../../constants';
import BottomCurveLine from './BottomCurveLine';
import CaretDownContainer from './CaretDownContainer';
import LogicDropdownContainer from './LogicDropdownContainer';
import LogicDropdwonOuterContainer from './LogicDropdownOuterContainer';
import LogicOptionDisplay from './LogicOptionDisplay';
import TopCurveLine from './TopCurveLine';
import VerticalLine from './VerticalLine';

export interface LogicDropdownProps {
  onChange: (value: TreeLogicExpressions) => void;
  value: TreeLogicExpressions;
  numConditions: number;
}

const LogicDropdown: React.FC<LogicDropdownProps> = ({ onChange, value = BaseNode.Utils.ExpressionTypeV2.AND, numConditions }) => {
  const [logicValue, setLogicValue] = React.useState<TreeLogicExpressions>(value);
  const hasMultipleConditions = numConditions > 1;

  return (
    <Dropdown
      options={[
        {
          label: BaseNode.Utils.ExpressionTypeV2.AND.toUpperCase(),
          onClick: () => {
            setLogicValue(BaseNode.Utils.ExpressionTypeV2.AND);
            onChange(BaseNode.Utils.ExpressionTypeV2.AND!);
          },
        },
        {
          label: BaseNode.Utils.ExpressionTypeV2.OR.toUpperCase(),
          onClick: () => {
            setLogicValue(BaseNode.Utils.ExpressionTypeV2.OR);
            onChange(BaseNode.Utils.ExpressionTypeV2.OR!);
          },
        },
      ]}
      placement="bottom"
      selfDismiss
    >
      {(ref, onToggle, isOpened) => (
        <LogicDropdwonOuterContainer>
          {hasMultipleConditions && (
            <>
              <TopCurveLine active={isOpened} />
              <VerticalLine topLine active={isOpened} />
            </>
          )}
          <LogicDropdownContainer ref={ref} onClick={onToggle} active={isOpened}>
            <LogicOptionDisplay>{logicValue?.toUpperCase()}</LogicOptionDisplay>
            <CaretDownContainer active={isOpened}>
              <SvgIcon icon="arrowToggle" width={10} height={5} rotation={isOpened ? 180 : 0} />
            </CaretDownContainer>
          </LogicDropdownContainer>
          {hasMultipleConditions && (
            <>
              <VerticalLine bottomLine active={isOpened} />
              <BottomCurveLine active={isOpened} />
            </>
          )}
        </LogicDropdwonOuterContainer>
      )}
    </Dropdown>
  );
};

export default LogicDropdown;
