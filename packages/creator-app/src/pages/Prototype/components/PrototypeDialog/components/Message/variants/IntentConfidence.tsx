import { Box, colors } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect, styled } from '@/hocs';
import { ConnectedProps } from '@/types';

import { MessageProps } from '../components/Message';

const IntentText = styled.div`
  color: ${colors('secondary')};

  ::first-letter {
    text-transform: capitalize;
  }

  font-weight: bold;
  font-style: normal;
  display: inline-block;
`;

const ConfidenceScore = styled.div`
  color: ${colors('secondary')};
  display: inline-block;
`;

type IntentConfidenceProps = Omit<MessageProps, 'iconProps'> & {
  message: string;
};

export const IntentConfidence: React.FC<IntentConfidenceProps & ConnectedIntentConfidenceProps> = ({ message, getDiagram, ...props }) => {
  const intentMessage = `${message.split('**')[1]} - `;
  const confidenceMessage = ` ${message.split('confidence interval')[1].split('_')[1]}`;

  return (
    <Box mt={8} mb={12} fontSize={13} style={{ textAlign: 'right', marginTop: '-16px' }} {...props}>
      <IntentText>{intentMessage}</IntentText>
      <ConfidenceScore> {confidenceMessage}</ConfidenceScore>
    </Box>
  );
};

const mapStateToProps = {
  getDiagram: Diagram.diagramByIDSelector,
};

type ConnectedIntentConfidenceProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(IntentConfidence);
