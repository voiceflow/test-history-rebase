import { Flex, Input } from '@voiceflow/ui';
import _upperFirst from 'lodash/upperFirst';
import React from 'react';

import { Add, ButtonContainer, Minus } from '@/components/InteractiveIcon';
import Section from '@/components/Section';
import { styled, units } from '@/hocs/styled';

const FieldContainer = styled(Flex)`
  :not(:last-child) {
    margin-bottom: ${units(1.5)}px;
  }

  ${ButtonContainer} {
    margin-left: 20px;
  }
`;

const MultiFields = ({ type, tooltipContent, onAdd, onRemove, handleChange, fields }) => {
  const AddMappingButton = <Add onClick={() => onAdd(type)} />;
  const disabledRemove = fields.length === 1;

  const onChange = React.useCallback((index, e) => handleChange(index, e, type), [type, handleChange]);

  return (
    <Section variant="secondary" header={_upperFirst(type)} style={{ paddingBottom: 24 }} status={AddMappingButton} tooltip={tooltipContent}>
      {fields.map((field, index) => (
        <FieldContainer key={index}>
          <Input placeholder={`Add ${type}`} value={field} onChange={(e) => onChange(index, e)} />
          <Minus disabled={disabledRemove} onClick={() => !disabledRemove && onRemove(index, type)} />
        </FieldContainer>
      ))}
    </Section>
  );
};

export default MultiFields;
