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

const LogicGroupDropdown: React.OldFC<LogicGroupDropdownProps> = ({
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
      {(ref, onToggle, isOpened) => (
        <S.OuterContainer style={{ marginTop: topOffset, marginBottom: bottomOffset }}>
          {hasMultipleConditions && (
            <>
              <Box.FlexAlignStart>
                <S.TopCurve active={isOpened} />
                <S.BoxLine active={isOpened} />
              </Box.FlexAlignStart>
              <S.VerticalLine topLine active={isOpened} />
            </>
          )}
          <S.DropdownContainer ref={ref} onClick={onToggle} active={isOpened}>
            <S.LogicOptionDisplay>{logicValue?.toUpperCase()}</S.LogicOptionDisplay>
            <S.CaretDownContainer active={isOpened}>
              <SvgIcon icon="arrowToggle" width={10} height={5} rotation={180} />
            </S.CaretDownContainer>
          </S.DropdownContainer>
          {hasMultipleConditions && (
            <>
              <S.VerticalLine bottomLine active={isOpened} />
              <Box.FlexAlignEnd>
                <S.BottomCurve active={isOpened} />
                <S.BoxLine active={isOpened} />
              </Box.FlexAlignEnd>
            </>
          )}
        </S.OuterContainer>
      )}
    </Dropdown>
  );
};

export default LogicGroupDropdown;
