import _upperFirst from 'lodash/upperFirst';
import React from 'react';

import AddMinusButton, { ButtonContainer } from '@/components/AddMinusButton';
import Flex from '@/components/Flex';
import Input from '@/components/Input';
import Section from '@/components/Section';
import { styled, units } from '@/hocs';

const FieldContainer = styled(Flex)`
  :not(:last-child) {
    margin-bottom: ${units(1.5)}px;
  }

  ${ButtonContainer} {
    margin-left: 20px;
  }
`;

const MultiFields = ({ type, tooltipContent, onAdd, onRemove, handleChange, fields }) => {
  const AddMappingButton = <AddMinusButton type="add" onClick={() => onAdd(type)} />;
  const disabledRemove = fields.length === 1;

  const onChange = React.useCallback((index, e) => handleChange(index, e, type), [type, handleChange]);

  return (
    <Section variant="secondary" header={_upperFirst(type)} style={{ paddingBottom: 24 }} status={AddMappingButton} tooltip={tooltipContent}>
      {fields.map((field, index) => (
        <FieldContainer key={index}>
          <Input placeholder={`Add ${type}`} value={field} onChange={(e) => onChange(index, e)} />
          <AddMinusButton disabled={disabledRemove} type="minus" onClick={() => !disabledRemove && onRemove(index, type)} />
        </FieldContainer>
      ))}
    </Section>
  );
};

export default MultiFields;
