import React from 'react';

import client from '@/clientV2';
import AlertMessage, { AlertMessageVariant } from '@/components/AlertMessage';
import Button, { ButtonVariant } from '@/components/Button';
import { Container, Item } from '@/components/Menu/components';
import { useAsyncMountUnmount, useSmartReducerV2 } from '@/hooks';

import { ButtonContainer, ButtonLink, Description, LoaderStage, StageContainer } from '../components';

type WaitProjectStageProps = {
  updateCurrentStage: (googleProjectID: string) => void;
  cancel: () => void;
};

const WaitProjectStage: React.FC<WaitProjectStageProps> = ({ updateCurrentStage, cancel }) => {
  const [projects, setProjects] = React.useState<{ id: string; name?: string }[]>([]);

  const [state, api] = useSmartReducerV2({
    error: false,
    loading: true,
  });

  useAsyncMountUnmount(async () => {
    try {
      const projectIDs = await client.googleService.project.getGoogleProjects();

      api.update({
        error: false,
        loading: false,
      });

      setProjects(projectIDs);
    } catch {
      api.update({
        error: true,
        loading: false,
      });
    }
  });

  return state.loading ? (
    <LoaderStage>Loading Projects</LoaderStage>
  ) : (
    <StageContainer>
      {/* eslint-disable-next-line no-nested-ternary */}
      {state.error ? (
        <AlertMessage variant={AlertMessageVariant.DANGER} mb={0} mt={4}>
          Failed to retrieve projects for your Google developer account
        </AlertMessage>
      ) : projects.length ? (
        <>
          <Description>Please select a Google project to link to this Voiceflow project.</Description>

          <Container>
            {projects.map(({ id, name }) => (
              <Item key={id} onClick={() => updateCurrentStage(id)}>
                {name || id}
              </Item>
            ))}
          </Container>
        </>
      ) : (
        <>
          <Description>Looks like you don't have a Google Actions project, create one to get started!</Description>

          <ButtonContainer>
            <ButtonLink href="https://console.actions.google.com/" onClick={cancel}>
              <Button variant={ButtonVariant.PRIMARY}>Create Actions Project</Button>
            </ButtonLink>
          </ButtonContainer>
        </>
      )}
    </StageContainer>
  );
};

export default WaitProjectStage;
