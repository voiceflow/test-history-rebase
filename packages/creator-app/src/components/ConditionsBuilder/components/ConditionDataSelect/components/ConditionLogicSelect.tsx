import { BaseNode } from '@voiceflow/base-types';
import { Box, BoxFlexAlignStart, Checkbox } from '@voiceflow/ui';
import React from 'react';

import { ExpressionDisplayLabel, ExpressionWithNoSecondValue } from '@/components/ConditionsBuilder/constants';
import { ExpressionDataLogicType } from '@/components/ConditionsBuilder/types';
import { RadioOption } from '@/components/RadioGroup';
import RadioButtonContainer from '@/components/RadioGroup/components/RadioButtonContainer';

import ConditionValueSelect from '../../ConditionValueSelect';

export const ExpressionListOptions: RadioOption<ExpressionDataLogicType>[] = [
  {
    id: BaseNode.Utils.ExpressionTypeV2.EQUALS,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.EQUALS]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.GREATER,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.GREATER]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.LESS,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.LESS]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.CONTAINS,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.CONTAINS]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.STARTS_WITH,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.STARTS_WITH]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.ENDS_WITH,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.ENDS_WITH]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.HAS_VALUE,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.HAS_VALUE]}</Box>,
  },
  {
    id: BaseNode.Utils.ExpressionTypeV2.IS_EMPTY,
    label: <Box>{ExpressionDisplayLabel[BaseNode.Utils.ExpressionTypeV2.IS_EMPTY]}</Box>,
  },
];

export interface ConditionLogicSelectProps {
  logicValue: ExpressionDataLogicType;
  onLogicUpdate: (value: ExpressionDataLogicType) => void;
  conditionValue?: string;
  onConditionValueUpdate: (data: { value: string; type: BaseNode.Utils.ExpressionTypeV2.VARIABLE | BaseNode.Utils.ExpressionTypeV2.VALUE }) => void;
  onClose: () => void;
}

const ConditionLogicSelect: React.FC<ConditionLogicSelectProps> = ({
  logicValue,
  onLogicUpdate,
  conditionValue,
  onConditionValueUpdate,
  onClose,
}) => {
  React.useEffect(() => {
    if (ExpressionWithNoSecondValue.includes(logicValue)) {
      onConditionValueUpdate({ value: '', type: BaseNode.Utils.ExpressionTypeV2.VALUE });
    }
  }, [logicValue]);

  return (
    <>
      {ExpressionListOptions.map(({ id, label }, index) => {
        const isChecked = logicValue === id;
        const isLast = index === ExpressionListOptions.length - 1;

        const changeLogic = (id: ExpressionDataLogicType) => () => {
          onLogicUpdate(id);
        };

        return (
          <BoxFlexAlignStart column fullWidth key={index}>
            <RadioButtonContainer noBottomPadding={isLast && !isChecked} paddingBottom={8} column cursor="pointer">
              <Checkbox type={Checkbox.Type.RADIO} value={id} checked={isChecked} onChange={changeLogic(id)} isFlat>
                <div>{label}</div>
              </Checkbox>
            </RadioButtonContainer>
            {isChecked && !ExpressionWithNoSecondValue.includes(id) && (
              <Box mb={16} fullWidth>
                <ConditionValueSelect value={conditionValue} onChange={onConditionValueUpdate} onClose={onClose} />
              </Box>
            )}
          </BoxFlexAlignStart>
        );
      })}
    </>
  );
};

export default ConditionLogicSelect;
