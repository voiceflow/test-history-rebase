import { ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import Box, { FlexAlignStart } from '@/components/Box';
import Checkbox, { CheckboxType } from '@/components/Checkbox';
import { ExpressionDisplayLabel, ExpressionWithNoSecondValue } from '@/components/ConditionsBuilder/constants';
import { ExpressionDataLogicType } from '@/components/ConditionsBuilder/types';
import { RadioOption } from '@/components/RadioGroup';
import RadioButtonContainer from '@/components/RadioGroup/components/RadioButtonContainer';

import ConditionValueSelect from '../../ConditionValueSelect';

export const ExpressionListOptions: RadioOption<ExpressionDataLogicType>[] = [
  {
    id: ExpressionTypeV2.EQUALS,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.EQUALS]}</Box>,
  },
  {
    id: ExpressionTypeV2.NOT_EQUAL,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.NOT_EQUAL]}</Box>,
  },
  {
    id: ExpressionTypeV2.GREATER,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.GREATER]}</Box>,
  },
  {
    id: ExpressionTypeV2.GREATER_OR_EQUAL,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.GREATER_OR_EQUAL]}</Box>,
  },
  {
    id: ExpressionTypeV2.LESS,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.LESS]}</Box>,
  },
  {
    id: ExpressionTypeV2.LESS_OR_EQUAL,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.LESS_OR_EQUAL]}</Box>,
  },
  {
    id: ExpressionTypeV2.CONTAINS,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.CONTAINS]}</Box>,
  },
  {
    id: ExpressionTypeV2.NOT_CONTAIN,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.NOT_CONTAIN]}</Box>,
  },
  {
    id: ExpressionTypeV2.STARTS_WITH,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.STARTS_WITH]}</Box>,
  },
  {
    id: ExpressionTypeV2.ENDS_WITH,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.ENDS_WITH]}</Box>,
  },
  {
    id: ExpressionTypeV2.HAS_VALUE,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.HAS_VALUE]}</Box>,
  },
  {
    id: ExpressionTypeV2.IS_EMPTY,
    label: <Box>{ExpressionDisplayLabel[ExpressionTypeV2.IS_EMPTY]}</Box>,
  },
];

export type ConditionLogicSelectProps = {
  logicValue: ExpressionDataLogicType;
  onLogicUpdate: (value: ExpressionDataLogicType) => void;
  conditionValue?: string;
  onConditionValueUpdate: (data: { value: string; type: ExpressionTypeV2.VARIABLE | ExpressionTypeV2.VALUE }) => void;
  onClose: () => void;
};

const ConditionLogicSelect: React.FC<ConditionLogicSelectProps> = ({
  logicValue,
  onLogicUpdate,
  conditionValue,
  onConditionValueUpdate,
  onClose,
}) => {
  React.useEffect(() => {
    if (ExpressionWithNoSecondValue.includes(logicValue)) {
      onConditionValueUpdate({ value: '', type: ExpressionTypeV2.VALUE });
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
          <FlexAlignStart column fullWidth key={index}>
            <RadioButtonContainer noBottomPadding={isLast && !isChecked} paddingBottom={8} column cursor="pointer">
              <Checkbox type={CheckboxType.RADIO} value={id} checked={isChecked} onChange={changeLogic(id)} isFlat>
                <div>{label}</div>
              </Checkbox>
            </RadioButtonContainer>
            {isChecked && !ExpressionWithNoSecondValue.includes(id) && (
              <Box mb={16} fullWidth>
                <ConditionValueSelect value={conditionValue} onChange={onConditionValueUpdate} onClose={onClose} />
              </Box>
            )}
          </FlexAlignStart>
        );
      })}
    </>
  );
};

export default ConditionLogicSelect;
