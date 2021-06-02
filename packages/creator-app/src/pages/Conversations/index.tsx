import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { ConversationsContainer, TranscriptDetails, TranscriptDialog, TranscriptManager } from './components';

type ConversationProps = RouteComponentProps;

const Conversations: React.FC<ConversationProps & ConnectedConversationsProps> = () => (
  <ConversationsContainer>
    <TranscriptManager />
    <TranscriptDialog />
    <TranscriptDetails />
  </ConversationsContainer>
);

const mapStateToProps = {};

type ConnectedConversationsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Conversations);
