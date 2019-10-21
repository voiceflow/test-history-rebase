import React from 'react';

import Button from '@/components/Button';
import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import { REPROMPT_TYPE } from '@/constants';

import { Audio, Container, Header, Text } from './components';

const REPROMPT_EDITORS = [
  {
    label: 'Text',
    value: REPROMPT_TYPE.TEXT,
    component: Text,
  },
  {
    label: 'Audio',
    value: REPROMPT_TYPE.AUDIO,
    component: Audio,
  },
];

function Reprompt({ data, onChange }) {
  if (!data.reprompt) {
    return null;
  }

  const { type } = data.reprompt;
  const removeReprompt = () => onChange({ reprompt: null });
  const updateRepromptType = (type) => onChange({ reprompt: { ...data.reprompt, type } });

  return (
    <Container>
      <Header>
        <label>Custom Reprompt</label>
        <Button className="close" onClick={removeReprompt} />
      </Header>
      <ButtonGroupRouter selected={type} routes={REPROMPT_EDITORS} routeProps={{ data, onChange }} onChange={updateRepromptType} />
    </Container>
  );
}

export default Reprompt;
