import { ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import Box from '@/components/Box';
import RadioGroup, { RadioOption } from '@/components/RadioGroup';

import { ExpressionDisplayLabel } from '../constants';
import { ExpressionDataLogicType } from '../types';

const ExpressionListOptions: RadioOption<ExpressionDataLogicType>[] = [
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
  value: ExpressionDataLogicType;
  onChange: (value: ExpressionDataLogicType) => void;
};

const ConditionLogicSelect: React.FC<ConditionLogicSelectProps> = ({ value, onChange }) => (
  <RadioGroup column options={ExpressionListOptions.filter((option) => option.id !== value)} checked={value} onChange={onChange} />
);

export default ConditionLogicSelect;
