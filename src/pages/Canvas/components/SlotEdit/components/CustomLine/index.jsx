import React from 'react';

import Input from '@/components/Input';
import SvgIcon from '@/components/SvgIcon';

import { ButtonContainer, Container, SynonymContainer, ValueContainer } from './components';

function CustomLine({ remove, value: { value, synonyms }, onBlur, onChange, removeDisabled }) {
  return (
    <Container>
      <ValueContainer>
        <Input value={value} onBlur={onBlur} onChange={(e) => onChange({ value: e.target.value })} placeholder="Slot Value" />
      </ValueContainer>

      <SynonymContainer>
        <Input value={synonyms} onBlur={onBlur} onChange={(e) => onChange({ synonyms: e.target.value })} placeholder="Slot Synonyms (optional)" />
      </SynonymContainer>

      <ButtonContainer disabled={removeDisabled}>
        <SvgIcon variant="standard" clickable size={11} icon="zoomOut" onClick={remove} />
      </ButtonContainer>
    </Container>
  );
}

export default CustomLine;
