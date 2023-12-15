import { BaseUtils } from '@voiceflow/base-types';
import { useLocalStorageState } from '@voiceflow/ui';
import { Box, Text, TextArea, toast } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import { Modal } from '@/components/Modal';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../../manager';
import { PreviewQuestionResponse } from './PreviewQuestionResponse.component';
import { buttonStyles, labelStyles, textareaStyles } from './PreviewQuestionResponse.css';

export const KB_PREVIEW_LAST_QUESTION = 'persist:kb-preview:last-question';

export const PreviewQuestion = manager.create('KBPreviewQuestion', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [question, setQuestion] = React.useState<string>('');
  const [hasResponse, setHasResponse] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();
  const [response, setResponse] = React.useState<{ output: string; chunks?: { source: { name: string }; content: string }[] } | null>(null);
  const [previousQuestion, setPreviousQuestion] = useLocalStorageState(KB_PREVIEW_LAST_QUESTION, '');

  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const displayableSources = response?.chunks?.filter((chunk) => chunk.source);

  const fetchAnswer = async () => {
    api.preventClose();
    const currentQuestion = question;
    setPreviousQuestion(currentQuestion);
    const response = await client.testAPIClient
      .knowledgeBase(workspaceID, { projectID, versionID, question })
      .catch(() => toast.error('Unable to reach knowledge base.', { isClosable: false }));
    if (!response?.output) {
      await trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'No' });
      setHasResponse(false);
      setResponse({ output: `${currentQuestion}\n---\n${BaseUtils.ai.KNOWLEDGE_BASE_NOT_FOUND} Unable to find relevant answer.` });
    } else {
      await trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'Yes' });
      setHasResponse(true);
      setResponse(response);
    }
    setQuestion('');
    api.enableClose();
  };

  const usePreviousQuestion = () => {
    setQuestion(previousQuestion);
  };

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} stacked animated={animated} onExited={api.remove} width="400px">
      <>
        <Modal.Header title="Knowledge base preview" onClose={api.onClose} secondaryButton={<Modal.Header.SecondaryButton iconName="Settings" />} />

        <Box pt={20} px={24} pb={24} direction="column">
          <Text variant="fieldLabel" className={labelStyles}>
            Question
          </Text>
          <TextArea
            autoFocus
            disabled={closePrevented}
            value={question}
            onValueChange={setQuestion}
            placeholder="Enter question..."
            maxHeight={136}
            minHeight={16}
            variant="default"
            className={textareaStyles}
          />
        </Box>

        <Modal.Footer>
          {response ? (
            <Modal.Footer.Button label="Re-use last question" variant="secondary" onClick={usePreviousQuestion} disabled={closePrevented} />
          ) : (
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} disabled={closePrevented} />
          )}

          <Modal.Footer.Button
            label="Send"
            variant="primary"
            onClick={fetchAnswer}
            disabled={closePrevented}
            isLoading={closePrevented}
            className={buttonStyles}
          />
        </Modal.Footer>
      </>

      {response && (
        <>
          <PreviewQuestionResponse loading={closePrevented} response={response?.output} hasResponse={hasResponse} sources={displayableSources} />
        </>
      )}
    </Modal.Container>
  );
});
