import React from 'react';

import EditableComment from '@/pages/Canvas/components/ThreadEditor/components/EditableComment';

import { Container } from './components';

export const HEIGHT = 150;

const TranscriptNotes: React.FC = () => {
  return (
    <Container height={HEIGHT}>
      <EditableComment
        height={HEIGHT}
        placeholder="Leave notes or @mention"
        isEditing={true}
        initialValues={undefined}
        onSave={() => alert('saved!')}
        hasHeader={false}
      />
    </Container>
  );
};

export default TranscriptNotes;
