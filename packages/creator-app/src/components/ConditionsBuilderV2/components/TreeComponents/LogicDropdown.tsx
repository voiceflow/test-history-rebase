import { BaseNode } from '@voiceflow/base-types';
import { Dropdown, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { TreeLogicExpressions } from '../../constants';
import BottomCurveLine from './BottomCurveLine';
import CaretDownContainer from './CaretDownContainer';
import LogicDropdownContainer from './LogicDropdownContainer';
import LogicOptionDisplay from './LogicOptionDisplay';
import TopCurveLine from './TopCurveLine';
import VerticalLine from './VerticalLine';

// export interface LogicDropdownProps {
//   onChange: (value: Nullable<TreeLogicExpressions>) => void;
// }

const LogicDropdown: React.FC = () => {
  const [logicValue, setLogicValue] = React.useState<TreeLogicExpressions>();

  return (
    <Dropdown
      options={[
        {
          label: BaseNode.Utils.ExpressionTypeV2.AND.toUpperCase,
          onClick: () => setLogicValue(BaseNode.Utils.ExpressionTypeV2.AND),
        },
        {
          label: BaseNode.Utils.ExpressionTypeV2.OR.toUpperCase(),
          onClick: () => setLogicValue(BaseNode.Utils.ExpressionTypeV2.OR),
        },
      ]}
      placement="bottom"
      selfDismiss
    >
      {(ref, onToggle, isOpened) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', width: '80px' }}>
          <TopCurveLine active={isOpened} />
          <VerticalLine topLine active={isOpened} />
          <LogicDropdownContainer ref={ref} onClick={onToggle} active={isOpened}>
            <LogicOptionDisplay>{logicValue?.toUpperCase() || 'AND'}</LogicOptionDisplay>
            <CaretDownContainer active={isOpened}>
              <SvgIcon icon="arrowToggle" width={10} height={5} rotation={isOpened ? 180 : 0} />
            </CaretDownContainer>
          </LogicDropdownContainer>
          <VerticalLine bottomLine active={isOpened} />
          <BottomCurveLine active={isOpened} />
        </div>
      )}
    </Dropdown>
  );
};

export default LogicDropdown;
