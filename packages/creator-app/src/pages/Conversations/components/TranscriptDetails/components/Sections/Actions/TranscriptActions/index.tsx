import React from 'react';

import { Container } from './components';
import ActionButton from './components/ActionButton';

export function TranscriptActions() {
  const [reviewed, setReviewed] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <Container>
      <ActionButton onClick={() => setReviewed(!reviewed)} icon={reviewed ? 'activeReviewed' : 'actionsCheckmark'} label="Mark as Reviewed" />
      <ActionButton onClick={() => setSaved(!saved)} icon={saved ? 'activeBookmark' : 'bookmark'} label="Save for Later" />
      <ActionButton onClick={() => alert('Deleted')} icon="garbage" label="Delete" />
    </Container>
  );
}
