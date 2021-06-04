import React from 'react';

import THEME from '@/styles/theme';

import { Container } from './components';
import ActionButton from './components/ActionButton';

export function TranscriptActions() {
  const [reviewed, setReviewed] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <Container>
      <ActionButton
        onClick={() => setReviewed(!reviewed)}
        icon={reviewed ? 'checkmarkFilled' : 'check2'}
        color={reviewed ? '#3e9e3e' : THEME.colors.tertiary}
        label="Mark as Reviewed"
      />
      <ActionButton
        left={1}
        onClick={() => setSaved(!saved)}
        icon="bookmark"
        label="Save for Later"
        color={saved ? THEME.colors.red : THEME.colors.tertiary}
      />
      <ActionButton onClick={() => alert('Deleted')} icon="garbage" label="Delete" color={THEME.colors.tertiary} />
    </Container>
  );
}
