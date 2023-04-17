import { BaseNode } from '@voiceflow/base-types';
import { Box, Dropdown, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { TreeLogicExpressions } from '../../constants';
import * as S from './styles';

export interface LogicGroupDropdownProps {
  onChange: (value: TreeLogicExpressions) => void;
  value: TreeLogicExpressions;
  numConditions: number;
  topOffset: number;
  bottomOffset: number;
}

const LogicGroupDropdown: React.FC<LogicGroupDropdownProps> = ({
  topOffset,
  bottomOffset,
  onChange,
  value = BaseNode.Utils.ExpressionTypeV2.AND,
  numConditions,
}) => {
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
      {({ ref, onToggle, isOpen }) => (
        <S.OuterContainer style={{ marginTop: topOffset, marginBottom: bottomOffset }}>
          {hasMultipleConditions && (
            <>
              <Box.FlexAlignStart>
                <S.TopCurve active={isOpen} />
                <S.BoxLine active={isOpen} />
              </Box.FlexAlignStart>
              <S.VerticalLine topLine active={isOpen} />
            </>
          )}
          <S.DropdownContainer ref={ref} onClick={onToggle} active={isOpen}>
            <S.LogicOptionDisplay>{logicValue?.toUpperCase()}</S.LogicOptionDisplay>
            <S.CaretDownContainer active={isOpen}>
              <SvgIcon icon="arrowToggle" width={10} height={5} rotation={180} />
            </S.CaretDownContainer>
          </S.DropdownContainer>
          {hasMultipleConditions && (
            <>
              <S.VerticalLine bottomLine active={isOpen} />
              <Box.FlexAlignEnd>
                <S.BottomCurve active={isOpen} />
                <S.BoxLine active={isOpen} />
              </Box.FlexAlignEnd>
            </>
          )}
        </S.OuterContainer>
      )}
    </Dropdown>
  );
};

export default LogicGroupDropdown;
