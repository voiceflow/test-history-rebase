import { BaseUtils } from '@voiceflow/base-types';
import { useLocalStorageState } from '@voiceflow/ui';
import { Box, Text, TextArea, toast, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import { Modal } from '@/components/Modal';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../../manager';
import { KBPreviewQuestionResponse } from './KBPreviewQuestionResponse.component';
import { textareaStyles } from './KnowledgeBasePreviewQuestion.css';

export const KnowledgeBasePreviewQuestion = manager.create(
  'KnowledgeBasePreviewQuestion',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const [trackingEvents] = useTrackingEvents();

      const [question, setQuestion] = React.useState<string>('');
      const [response, setResponse] = React.useState<{ output: string; chunks?: { source: { name: string }; content: string }[] } | null>(null);
      const [hasResponse, setHasResponse] = React.useState(false);
      const [previousQuestion, setPreviousQuestion] = useLocalStorageState('persist:kb-preview:last-question', '');

      const projectID = useSelector(Session.activeProjectIDSelector)!;
      const versionID = useSelector(Session.activeVersionIDSelector)!;
      const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

      const displayableSources = React.useMemo(() => response?.chunks?.filter((chunk) => chunk.source), [response?.chunks]);

      const onSend = async () => {
        api.preventClose();

        const currentQuestion = question;
        setPreviousQuestion(currentQuestion);

        const response = await client.testAPIClient
          .knowledgeBase(workspaceID, { projectID, versionID, question })
          .catch(() => toast.error('Unable to reach knowledge base.', { isClosable: false }));

        if (!response?.output) {
          setHasResponse(false);
          setResponse({ output: `${currentQuestion}\n---\n${BaseUtils.ai.KNOWLEDGE_BASE_NOT_FOUND} Unable to find relevant answer.` });

          trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'No' });
        } else {
          setHasResponse(true);
          setResponse(response);

          trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'Yes' });
        }

        setQuestion('');
        api.enableClose();
      };

      const onSetPreviousQuestion = () => {
        setQuestion(previousQuestion);
      };

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} stacked animated={animated} onExited={api.remove} width="400px">
          <>
            <Modal.Header
              title="Knowledge base preview"
              onClose={api.onClose}
              secondaryButton={<Modal.Header.SecondaryButton iconName="Settings" />}
            />

            <Box pt={20} px={24} pb={24} direction="column" gap={6}>
              <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
                Question
              </Text>

              <TextArea
                value={question}
                disabled={closePrevented}
                autoFocus
                minHeight={16}
                maxHeight={136}
                className={textareaStyles}
                placeholder="Enter question..."
                onValueChange={setQuestion}
              />
            </Box>

            <Modal.Footer>
              {response ? (
                <Modal.Footer.Button label="Re-use last question" variant="secondary" onClick={onSetPreviousQuestion} disabled={closePrevented} />
              ) : (
                <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} disabled={closePrevented} />
              )}

              <Modal.Footer.Button label="Send" variant="primary" onClick={onSend} disabled={closePrevented} isLoading={closePrevented} />
            </Modal.Footer>
          </>

          {response && (
            <KBPreviewQuestionResponse loading={closePrevented} sources={displayableSources} response={response?.output} hasResponse={hasResponse} />
          )}
        </Modal.Container>
      );
    }
);
