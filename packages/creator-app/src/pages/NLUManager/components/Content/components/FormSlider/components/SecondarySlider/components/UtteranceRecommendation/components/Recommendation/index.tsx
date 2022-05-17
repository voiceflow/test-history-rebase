import { Box, IconButton, IconButtonVariant, Input, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { Container } from './components';

interface RecommendationProps {
  text: string;
  onDecline: () => void;
  onAccept: (text: string) => void;
}

const Recommendation: React.FC<RecommendationProps> = ({ onDecline, text, onAccept }) => {
  const [localText, setLocalText] = useLinkedState(text);
  return (
    <Container>
      <Input value={localText} onChangeText={setLocalText} />
      <Box display="flex" width={80} ml={24} alignItems="center">
        <IconButton inline style={{ marginRight: 16 }} onClick={onDecline} icon="close" variant={IconButtonVariant.BASIC} />
        <IconButton inline onClick={() => onAccept(localText)} icon="check" variant={IconButtonVariant.BASIC} />
      </Box>
    </Container>
  );
};

export default Recommendation;
