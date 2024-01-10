import { BaseUtils } from '@voiceflow/base-types';
import { useDidUpdateEffect, useForceUpdate, useLocalStorageState, useSessionStorageState, useToggle } from '@voiceflow/ui';
import { Box, Link, Text, TextArea, toast, Tokens } from '@voiceflow/ui-next';
import React from 'react';
import { generatePath, useHistory } from 'react-router';

import client from '@/client';
import { Modal } from '@/components/Modal';
import { Path } from '@/config/routes';
import { REQUEST_MORE_TOKENS } from '@/constants';
import { Designer, Session } from '@/ducks';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../../manager';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import { KBPreviewQuestionResponse } from './KBPreviewQuestionResponse.component';
import { KBPreviewSettings } from './KBPreviewSettings.component';
import { popperStyles, textareaStyles } from './KnowledgeBasePreviewQuestion.css';

const KB_PREVIEW_QUESTION_INPUT_ELEMENT_ID = 'kb-preview-question-input-id';

export const KnowledgeBasePreviewQuestion = manager.create(
  'KnowledgeBasePreviewQuestion',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const [trackingEvents] = useTrackingEvents();
      const questionRef = React.useRef<HTMLTextAreaElement>(null);

      const storeSettings = useSelector(Designer.KnowledgeBase.selectors.settings);

      const [initialSettings] = React.useState(storeSettings ?? DEFAULT_SETTINGS);
      const [settings, setSettings] = useSessionStorageState('persist:kb-preview-settings', storeSettings ?? DEFAULT_SETTINGS);
      const [question, setQuestion] = React.useState<string>('');
      const [questionError, setQuestionError] = React.useState<string>('');
      const [response, setResponse] = React.useState<{ output: string; chunks?: { source: { name: string }; content: string }[] } | null>(null);
      const [hasResponse, setHasResponse] = React.useState(false);
      const [previousQuestion, setPreviousQuestion] = useLocalStorageState('persist:kb-preview:last-question', '');
      const history = useHistory();
      const getOneDocumentByName = useSelector(Designer.KnowledgeBase.selectors.getOneDocumentByName);
      const [isPreviewSettingsOpen, togglePreviewSettings] = useToggle(false);
      const [showSettings, setShowSettings] = React.useState(true);

      const projectID = useSelector(Session.activeProjectIDSelector)!;
      const versionID = useSelector(Session.activeVersionIDSelector)!;
      const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
      const [triggerRefocus, refocusTrigger] = useForceUpdate();

      useDidUpdateEffect(() => {
        const inputEl = document.getElementById(KB_PREVIEW_QUESTION_INPUT_ELEMENT_ID);
        inputEl?.focus();
      }, [refocusTrigger]);

      const displayableSources = React.useMemo(() => response?.chunks?.filter((chunk) => chunk.source), [response?.chunks]);

      const handleSourceClick = (sourceName: string) => {
        const documentID = getOneDocumentByName(sourceName)?.id;

        if (!documentID || !versionID) return;

        history.push(`${generatePath(Path.CMS_KNOWLEDGE_BASE, { versionID })}/${documentID}`);
        api.close();
      };

      const onSend = async () => {
        const currentQuestion = question;
        if (currentQuestion.trim() === '') {
          setQuestionError('Question is required.');
          return;
        }
        api.preventClose();

        setPreviousQuestion(currentQuestion);

        const response = await client.testAPIClient
          .knowledgeBase(workspaceID, { projectID, versionID, question, settings: settings?.summarization })
          .catch((error) => {
            if (error?.response?.status === 429) {
              toast.error('Too many requests, please wait and try again', { isClosable: false });
            } else if (error?.response?.status === 402) {
              toast.error(
                <>
                  Out of tokens. <Link variant="secondary" href={REQUEST_MORE_TOKENS} label="Request more tokens." />
                </>,
                { isClosable: false }
              );
            } else {
              toast.error('Unable to reach knowledge base.', { isClosable: false });
            }
          });

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
        triggerRefocus();
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
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          stacked
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onExiting={() => setShowSettings(false)}
          className={popperStyles}
        >
          <>
            <Modal.Header
              title="Knowledge base preview"
              onClose={api.onClose}
              secondaryButton={
                showSettings && (
                  <KBPreviewSettings
                    isOpen={isPreviewSettingsOpen}
                    initialSettings={initialSettings}
                    settings={settings}
                    setSettings={setSettings}
                    onToggle={togglePreviewSettings}
                  />
                )
              }
            />

            <Box pt={20} px={24} pb={24} direction="column" gap={6}>
              <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
                Question
              </Text>

              <TextArea
                id={KB_PREVIEW_QUESTION_INPUT_ELEMENT_ID}
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
                caption={questionError}
                error={!!questionError}
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
            <KBPreviewQuestionResponse
              loading={closePrevented}
              sources={displayableSources}
              response={response?.output}
              hasResponse={hasResponse}
              onSourceClick={handleSourceClick}
            />
          )}
        </Modal.Container>
      );
    }
);
