import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'reactstrap';

import Box from '@/components/Box';
import Input from '@/components/Input';
import { ClickableText } from '@/components/Text';
import { toast } from '@/components/Toast';
import { API_ENDPOINT } from '@/config';
import * as Account from '@/ducks/account';
import * as Skill from '@/ducks/skill';
import { copy } from '@/utils/clipboard';

const TEXT_PAYLOAD = `{
  type: 'text',
  payload: string
}
`;

const INTENT_PAYLOAD = `{
  type: 'intent',
  payload: {
    query: '',
    intent: { name: string },
    entities: { name: string, value: string }[],
  }
}
`;

const PrototypeWebhook = () => {
  const projectID = useSelector(Skill.activeProjectIDSelector);
  const userID = useSelector(Account.userIDSelector);

  const url = `${API_ENDPOINT}/v2/prototype/webhook/${projectID}/${userID}`;

  const onClick = () => {
    copy(url);
    toast.success('Url is copied to clipboard');
  };

  return (
    <Box width={900} m="0 auto" p={60}>
      <h1>Prototype Webhook URL</h1>
      <hr />

      <Alert>
        Call the prototype webhook with these patterns in the <b>POST request body</b> to simulate a user interaction
      </Alert>

      <Alert>
        <b>Text Request</b> - raw string input for the NLP/NLU to resolve
        <hr />
        <pre>{TEXT_PAYLOAD}</pre>
      </Alert>

      <Alert>
        <b>Intent Request</b> - matches with Voiceflow intent names and assigns entity (slot) values to variables
        <hr />
        <pre>{INTENT_PAYLOAD}</pre>
      </Alert>

      <Box my={16} textAlign="right">
        <Input value={url} readOnly disabled />

        <ClickableText onClick={onClick} mt={8}>
          Copy To Clipboard
        </ClickableText>
      </Box>
    </Box>
  );
};

export default PrototypeWebhook;
