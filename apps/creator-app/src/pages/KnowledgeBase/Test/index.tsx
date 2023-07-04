import { Badge, Box, Input, Modal, SectionV2, ThemeColor, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { keyframes, styled } from '@/hocs/styled';
import { useSelector, useTrackingEvents } from '@/hooks';
import manager from '@/ModalsV2/manager';
import { ResponsePreviewContainer } from '@/pages/Canvas/managers/AIResponse/components/RootEditor/styles';

const widthAnimation = keyframes`
  25% {
    content: "";
  }
  50% {
    content: ".";
  }
  75% {
    content: "..";
  }
  100% {
    content: "...";
  }
`;

const Loading = styled.div`
  &:after {
    content: '...';
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ${widthAnimation} 1.5s infinite 0.3s;
    animation-fill-mode: forwards;
    width: 1.25em;
  }
`;

const TestKnowledgeBase = manager.create('TestKnowledgeBase', () => ({ api, type, opened, hidden, animated }) => {
  const [question, setQuestion] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();
  const [response, setResponse] = React.useState<{ output: string; chunks?: { source: { name: string }; content: string }[] } | null>(null);

  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const fetchAnswer = async () => {
    setLoading(true);
    setResponse(null);
    const currentQuestion = question;
    setQuestion('');
    const response = await client.testAPIClient.knowledgeBase(workspaceID, { projectID, question }).catch(() => {
      toast.error('Unable to connect with Knowledge Base');
      return null;
    });
    if (!response?.output) {
      await trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'No' });
      setResponse({ output: `${currentQuestion}\n---\nUnable to find relevant answer.` });
    } else {
      await trackingEvents.trackAiKnowledgeQuestionPreviewed({ Success: 'Yes' });
      setResponse({ ...response, output: `${currentQuestion}\n---\n${response.output}` });
    }
    setLoading(false);
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
        Preview Knowledge Base
      </Modal.Header>
      <SectionV2.Content pt={24} pb={32}>
        <Input
          disabled={loading}
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask a question"
          onEnterPress={fetchAnswer}
          nested
          rightAction={
            !!question && (
              <Badge slide onClick={fetchAnswer}>
                Enter
              </Badge>
            )
          }
        />
        {loading && (
          <Box mt={16}>
            <ResponsePreviewContainer>
              <Loading>Generating response</Loading>
            </ResponsePreviewContainer>
          </Box>
        )}
        {response && (
          <>
            <Box mt={16}>
              <ResponsePreviewContainer>{response.output}</ResponsePreviewContainer>
            </Box>
            {response.chunks?.length && (
              <>
                <SectionV2.CollapseSection
                  minHeight={0}
                  defaultCollapsed
                  header={({ collapsed, onToggle }) => (
                    <Box.FlexApart onClick={onToggle} py={16} cursor="pointer">
                      <SectionV2.Title bold={!collapsed} secondary>
                        Sources
                      </SectionV2.Title>
                      <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                    </Box.FlexApart>
                  )}
                >
                  <Box.FlexColumn
                    gap={16}
                    pb={16}
                    fontSize={13}
                    color={ThemeColor.SECONDARY}
                    style={{ wordBreak: 'break-word' }}
                    alignItems="flex-start"
                  >
                    {response?.chunks?.map((chunk, index) => (
                      <React.Fragment key={index}>
                        {index !== 0 && <SectionV2.Divider />}
                        <div>
                          <Box fontWeight={600} mb={4}>
                            [{chunk.source.name}]
                          </Box>
                          {chunk.content.replace(/\s/g, ' ')}
                        </div>
                      </React.Fragment>
                    ))}
                  </Box.FlexColumn>
                </SectionV2.CollapseSection>
              </>
            )}
          </>
        )}
      </SectionV2.Content>
    </Modal>
  );
});

export default TestKnowledgeBase;
