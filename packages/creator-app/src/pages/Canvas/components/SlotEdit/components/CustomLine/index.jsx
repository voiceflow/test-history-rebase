import { Input, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { ButtonContainer, Container, SynonymContainer, ValueContainer } from './components';

const CustomLine = ({ remove, value: { value, synonyms }, onBlur, onChange, removeDisabled }) => (
  <Container>
    <ValueContainer>
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <Input autoFocus={!value} value={value} onBlur={onBlur} onChange={(e) => onChange({ value: e.target.value })} placeholder="Slot Value" />
    </ValueContainer>

    <SynonymContainer>
      <Input value={synonyms} onBlur={onBlur} onChange={(e) => onChange({ synonyms: e.target.value })} placeholder="Slot Synonyms (optional)" />
    </SynonymContainer>

    <ButtonContainer disabled={removeDisabled}>
      <SvgIcon variant="standard" clickable size={11} icon="zoomOut" onClick={remove} />
    </ButtonContainer>
  </Container>
);

export default CustomLine;
