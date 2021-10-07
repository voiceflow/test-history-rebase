import { Alert, AlertVariant, BlockText, Box, BoxFlex, Text, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { ModalFooter } from '@/components/LegacyModal';
import { useAsyncMountUnmount, useTeardown } from '@/hooks';
import { Container } from '@/pages/Collaborators/components/InviteByLink/components';

import { LoaderStage, ProjectItem, StageContainer } from '../components';
import { CreateAgentLink } from './components';

const Footer = ModalFooter as React.FC<any>;

interface WaitDFESProjectStageProps {
  cancel: () => void;
  onClose?: () => void;
  setMultiProjects?: (value: boolean) => void;
  updateCurrentStage: (
    selected: {
      googleProjectID: string;
      agentName: string;
    } | null
  ) => void;
}

const WaitDFESProjectStage: React.FC<WaitDFESProjectStageProps> = ({ updateCurrentStage, setMultiProjects }) => {
  const [projects, setProjects] = React.useState<{ googleProjectID: string; agentName: string }[]>([]);

  const [state, api] = useSmartReducerV2({ error: false, loading: true });

  useAsyncMountUnmount(async () => {
    try {
      const projectIDs = await client.platform.dialogflow.project.getDialogFlowESProjects();

      api.update({ error: false, loading: false });

      setProjects(projectIDs);
      setMultiProjects?.(projectIDs.length > 0);
    } catch {
      api.update({ error: true, loading: false });
    }
  });

  useTeardown(() => setMultiProjects?.(false));

  return (
    <>
      {state.loading ? (
        <LoaderStage>Loading Projects</LoaderStage>
      ) : (
        <StageContainer noPadding>
          {/* eslint-disable-next-line no-nested-ternary */}
          {state.error ? (
            <StageContainer>
              <Alert variant={AlertVariant.UNSTYLED} mb={0} mt={4}>
                Failed to retrieve projects for your Google developer account
              </Alert>
            </StageContainer>
          ) : projects.length ? (
            <StageContainer noPadding>
              <Box height={42} display="flex" mb={12} alignItems="flex-end" pl={24}>
                <Text fontWeight={600} fontSize={15}>
                  Connect to Agent
                </Text>
              </Box>

              <Box maxHeight={400} style={{ overflow: 'auto' }}>
                {projects.map(({ googleProjectID, agentName }) => (
                  <BoxFlex key={googleProjectID} fullWidth height={42} onClick={() => updateCurrentStage({ googleProjectID, agentName })}>
                    <ProjectItem>{agentName}</ProjectItem>
                  </BoxFlex>
                ))}
              </Box>

              <Box mt={9} height={68} style={{ border: '1px solid #f9f9f9', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <CreateAgentLink onClick={() => updateCurrentStage(null)}>Create New Agent</CreateAgentLink>
              </Box>
            </StageContainer>
          ) : (
            <StageContainer noPadding>
              <div style={{ padding: '24px 46px 24px 32px', textAlign: 'left' }}>
                <BlockText mb={15} fontSize={15} lineHeight="22px" color="#132144">
                  No agents exist on the Dialogflow ES Console to connect to. Create a new agent now.
                </BlockText>
              </div>

              <Footer>
                <Container>
                  <Box mt={9} height={68} padding="24px 60px" style={{ border: '1px solid #f9f9f9', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <ProjectItem style={{ padding: 0 }} onClick={() => updateCurrentStage(null)}>
                      Create New Agent
                    </ProjectItem>
                  </Box>
                </Container>
              </Footer>
            </StageContainer>
          )}
        </StageContainer>
      )}
    </>
  );
};

export default WaitDFESProjectStage;
