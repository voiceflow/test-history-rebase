import { BaseUtils } from '@voiceflow/base-types';
import { useLocalStorageState } from '@voiceflow/ui';
import { Box, Text, TextArea, toast, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import { Modal } from '@/components/Modal';
import { Designer, Session } from '@/ducks';
import { useSelector, useTrackingEvents } from '@/hooks';
import { useLinkedState } from '@/hooks/state.hook';

import manager from '../../../manager';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import { KBPreviewQuestionResponse } from './KBPreviewQuestionResponse.component';
import { KBPreviewSettings } from './KBPreviewSettings.component';
import { textareaStyles } from './KnowledgeBasePreviewQuestion.css';

export const KnowledgeBasePreviewQuestion = manager.create(
  'KnowledgeBasePreviewQuestion',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const [trackingEvents] = useTrackingEvents();
      const questionRef = React.useRef<HTMLTextAreaElement>(null);

      const storeSettings = useSelector(Designer.KnowledgeBase.selectors.settings);

      const [initialSettings] = React.useState(storeSettings ?? DEFAULT_SETTINGS);
      const [settings, setSettings] = useLinkedState(storeSettings ?? DEFAULT_SETTINGS);
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
          .knowledgeBase(workspaceID, { projectID, versionID, question, settings: settings?.summarization })
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
        questionRef.current?.focus();
      };

      const onSetPreviousQuestion = () => {
        setQuestion(previousQuestion);
      };

      const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
          onSend();
        }
      };

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} stacked animated={animated} onExited={api.remove} width="400px">
          <>
            <Modal.Header
              title="Knowledge base preview"
              onClose={api.onClose}
              secondaryButton={<KBPreviewSettings initialSettings={initialSettings} settings={settings} setSettings={setSettings} />}
            />

            <Box pt={20} px={24} pb={24} direction="column" gap={6}>
              <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
                Question
              </Text>

              <TextArea
                ref={questionRef}
                value={question}
                disabled={closePrevented}
                autoFocus
                minHeight={16}
                maxHeight={136}
                className={textareaStyles}
                placeholder="Enter question..."
                onValueChange={setQuestion}
                onKeyDown={onKeyDown}
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
