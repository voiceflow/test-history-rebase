import { BaseUtils } from '@voiceflow/base-types';
import { useLocalStorageState } from '@voiceflow/ui';
import { Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import { Modal } from '@/components/Modal';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents } from '@/hooks';
import * as AI from '@/pages/Canvas/managers/components/AI/hooks';

import manager from '../../../manager';
import { PreviewQuestionResponse } from './PreviewQuestionResponse.component';
import { buttonStyles } from './PreviewQuestionResponse.css';

export const KB_PREVIEW_LAST_QUESTION = 'persist:kb-preview:last-question';

export const PreviewQuestion = manager.create('KBPreviewQuestion', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [question, setQuestion] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [hasResponse, setHasResponse] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();
  const [response, setResponse] = React.useState<{ output: string; chunks?: { source: { name: string }; content: string }[] } | null>(null);
  const [previousQuestion, setPreviousQuestion] = useLocalStorageState(KB_PREVIEW_LAST_QUESTION, '');

  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const displayableSources = response?.chunks?.filter((chunk) => chunk.source);

  const fetchAnswer = async () => {
    setLoading(true);
    setResponse(null);
    const currentQuestion = question;
    setQuestion('');
    setPreviousQuestion(currentQuestion);
    const response = await client.testAPIClient
      .knowledgeBase(workspaceID, { projectID, versionID, question })
      .catch((error) => AI.showLLMError('Unable to reach Knowledge Base', error));
    if (!response?.output) {
      await trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'No' });
      setHasResponse(false);
      setResponse({ output: `${currentQuestion}\n---\n${BaseUtils.ai.KNOWLEDGE_BASE_NOT_FOUND} Unable to find relevant answer.` });
    } else {
      await trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'Yes' });
      setHasResponse(true);
      setResponse(response);
    }
    setLoading(false);
  };

  const usePreviousQuestion = () => {
    setQuestion(previousQuestion);
  };

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} stacked>
      <>
        <Modal.Header title="Knowledge base preview" onClose={api.close} secondaryButton={<Modal.Header.SecondaryButton iconName="Settings" />} />

        <Box pt={12} px={24} pb={24} direction="column">
          <TextField label="Question" value={question} onValueChange={setQuestion} placeholder="Enter question..." />
        </Box>

        <Modal.Footer>
          {response ? (
            <Modal.Footer.Button label="Re-use last question" variant="secondary" onClick={usePreviousQuestion} disabled={loading} />
          ) : (
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.close} disabled={loading} />
          )}
          <Modal.Footer.Button
            label="Send"
            variant="primary"
            onClick={fetchAnswer}
            disabled={closePrevented || loading}
            isLoading={loading}
            className={buttonStyles}
          />
        </Modal.Footer>
      </>

      {response && !loading && (
        <>
          <PreviewQuestionResponse response={response?.output} hasResponse={hasResponse} sources={displayableSources} />
        </>
      )}
    </Modal.Container>
  );
});
