import React from 'react';
import { useSelector } from 'react-redux';

import Box from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import { toast } from '@/components/Toast';
import { API_ENDPOINT } from '@/config';
import * as Account from '@/ducks/account';
import * as Skill from '@/ducks/skill';
import { copy } from '@/utils/clipboard';

const PrototypeWebhook = () => {
  const projectID = useSelector(Skill.activeProjectIDSelector);
  const userID = useSelector(Account.userIDSelector);

  const url = `${API_ENDPOINT}/v2/prototype/webhook/${projectID}/${userID}`;

  const onClick = () => {
    copy(url);
    toast.success('Url is copied to clipboard');
  };

  return (
    <Box mw={600} m="0 auto" p={60}>
      <h1>Prototype Webhook URL</h1>
      <Box mt={12}>
        <Button variant={ButtonVariant.TERTIARY} onClick={onClick}>
          Copy Prototype Webhook Url
        </Button>
      </Box>
    </Box>
  );
};

export default PrototypeWebhook;
