import { Alert, Button, SectionV2, System } from '@voiceflow/ui';
import React from 'react';

// this is meant to be removed after 12/15/2023
export const DeprecationWarning: React.FC<{ onUpdate: () => void }> = ({ onUpdate }) => {
  return (
    <SectionV2.Content topOffset={2.5}>
      <Alert>
        A new Knowledge Base step has been released to improve accuracy. Click the button below to update the step. Your prompt and settings will be
        saved. This step will be automatically converted on <b>12/15/2023</b>. To learn more about the changes, click{' '}
        <System.Link.Anchor href="https://learn.voiceflow.com/hc/en-us/articles/15613956094989-Using-the-Knowledge-Base">here</System.Link.Anchor>.
        <br />
        <br />
        <Button fullWidth onClick={onUpdate}>
          Update
        </Button>
      </Alert>
    </SectionV2.Content>
  );
};
