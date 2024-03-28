import { BaseUtils } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { useForceUpdate } from '@voiceflow/ui';
import { Box, Link, notify, Scroll, Text, TextArea, Tokens } from '@voiceflow/ui-next';
import React from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';
import { generatePath, useHistory } from 'react-router';

import client from '@/client';
import { Modal } from '@/components/Modal';
import { Path } from '@/config/routes';
import { REQUEST_MORE_TOKENS_LINK } from '@/constants/link.constant';
import { Designer, Session } from '@/ducks';
import { useEnvironmentSessionStorageState } from '@/hooks/storage.hook';
import { useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import manager from '../../../manager';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import { KBPreviewQuestionResponse } from './KBPreviewQuestionResponse.component';
import { KBPreviewSettings } from './KBPreviewSettings.component';
import { popperStyles, textareaStyles } from './KnowledgeBasePreviewQuestion.css';

export const KnowledgeBasePreviewQuestion = manager.create(
  'KnowledgeBasePreviewQuestion',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const TEST_ID = 'knowledge-base-preview-modal';

      const history = useHistory();
      const [trackingEvents] = useTrackingEvents();
      const dismissableLayer = React.useContext(DismissableLayerContext);
      const [triggerRefocus, refocusTriggerKey] = useForceUpdate();

      const projectID = useSelector(Session.activeProjectIDSelector)!;
      const versionID = useSelector(Session.activeVersionIDSelector)!;
      const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
      const getOneByName = useSelector(Designer.KnowledgeBase.Document.selectors.getOneByName);
      const storeSettings = useSelector(Designer.KnowledgeBase.selectors.settings);

      const [initialSettings] = React.useState(storeSettings ?? DEFAULT_SETTINGS);
      const [settings, setSettings] = useEnvironmentSessionStorageState('kb-preview-settings', storeSettings ?? DEFAULT_SETTINGS);
      const [question, setQuestion] = React.useState<string>('');
      const [response, setResponse] = React.useState<{ output: string; chunks?: { source: { name: string }; content: string }[] } | null>(null);
      const [hasResponse, setHasResponse] = React.useState(false);
      const [questionError, setQuestionError] = React.useState<string>('');
      const [previousQuestion, setPreviousQuestion] = useEnvironmentSessionStorageState('kb-preview-last-question', '');

      const displayableSources = React.useMemo(() => response?.chunks?.filter((chunk) => chunk.source), [response?.chunks]);

      const handleSourceClick = (sourceName: string) => {
        const documentID = getOneByName(sourceName)?.id;

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
          .knowledgeBase(workspaceID, {
            projectID,
            versionID,
            question,
            settings: settings?.summarization,
            instruction: settings?.summarization?.instruction,
          })
          .catch((error) => {
            if (error?.response?.status === 429) {
              notify.short.error('Too many requests, please wait and try again', { isClosable: false });
            } else if (error?.response?.status === 402) {
              notify.short.error(
                <>
                  Out of tokens. <Link variant="secondary" href={REQUEST_MORE_TOKENS_LINK} label="Request more tokens." />
                </>,
                { isClosable: false }
              );
            } else {
              notify.short.error('Unable to reach knowledge base.', { isClosable: false });
            }
          });

        if (!response?.output) {
          setHasResponse(false);
          setResponse({
            ...response,
            output: `${currentQuestion}\n---\n${BaseUtils.ai.KNOWLEDGE_BASE_NOT_FOUND} No answer found — context may be insufficient or data may not exist.`,
          });

          trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'No' });
        } else {
          setHasResponse(true);
          setResponse(response);

          trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'Yes' });
        }

        setQuestion('');
        setQuestionError('');
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
          testID={TEST_ID}
          stacked
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onExiting={() => dismissableLayer.dismissAllGlobally()}
          className={popperStyles}
        >
          <>
            <Modal.Header
              title="Knowledge base preview"
              onClose={api.onClose}
              testID={tid(TEST_ID, 'header')}
              secondaryButton={
                <KBPreviewSettings
                  testID={tid(TEST_ID, 'settings')}
                  settings={settings.summarization ?? DEFAULT_SETTINGS.summarization}
                  initialSettings={initialSettings.summarization ?? DEFAULT_SETTINGS.summarization}
                  onSettingsChange={(summarization) => setSettings({ ...settings, summarization })}
                />
              }
            />

            <Scroll style={{ display: 'block' }}>
              <Box pt={20} px={24} pb={24} direction="column" gap={6}>
                <Text variant="fieldLabel" color={Tokens.colors.neutralDark.neutralsDark100}>
                  Question
                </Text>

                <TextArea
                  key={refocusTriggerKey}
                  value={question}
                  error={!!questionError}
                  testID={tid(TEST_ID, 'question')}
                  onFocus={() => setQuestionError('')}
                  disabled={closePrevented}
                  autoFocus
                  onKeyDown={onKeyDown}
                  minHeight={16}
                  maxHeight={136}
                  className={textareaStyles}
                  placeholder="Enter question..."
                  onValueChange={setQuestion}
                  errorMessage={questionError}
                />
              </Box>
            </Scroll>

            <Modal.Footer>
              {response ? (
                <Modal.Footer.Button
                  label="Re-use last question"
                  variant="secondary"
                  onClick={onSetPreviousQuestion}
                  disabled={closePrevented}
                  testID={tid(TEST_ID, 'retry-question')}
                />
              ) : (
                <Modal.Footer.Button
                  label="Cancel"
                  variant="secondary"
                  onClick={api.onClose}
                  disabled={closePrevented}
                  testID={tid(TEST_ID, 'cancel')}
                />
              )}

              <Modal.Footer.Button
                label="Send"
                variant="primary"
                onClick={onSend}
                disabled={closePrevented}
                isLoading={closePrevented}
                testID={tid(TEST_ID, 'send')}
              />
            </Modal.Footer>
          </>

          {response && (
            <KBPreviewQuestionResponse
              loading={closePrevented}
              sources={displayableSources}
              response={response?.output}
              hasResponse={hasResponse}
              onSourceClick={handleSourceClick}
              testID={tid(TEST_ID, 'response')}
            />
          )}
        </Modal.Container>
      );
    }
);
