import { Input, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { ButtonContainer, Container, SynonymContainer, ValueContainer } from './components';

const CustomLine = ({ remove, value: { value, synonyms }, onBlur, onChange, removeDisabled }) => (
  <Container>
    <ValueContainer>
      <Input autoFocus={!value} value={value} onBlur={onBlur} onChangeText={(value) => onChange({ value })} placeholder="Entity Value" />
    </ValueContainer>

    <SynonymContainer>
      <Input value={synonyms} onBlur={onBlur} onChangeText={(synonyms) => onChange({ synonyms })} placeholder="Entity Synonyms (optional)" />
    </SynonymContainer>

    <ButtonContainer disabled={removeDisabled}>
      <SvgIcon variant="standard" clickable size={11} icon="zoomOut" onClick={remove} />
    </ButtonContainer>
  </Container>
);

export default CustomLine;
