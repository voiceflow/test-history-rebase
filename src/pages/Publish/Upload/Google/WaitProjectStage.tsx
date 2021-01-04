import React from 'react';

import client from '@/client';
import AlertMessage, { AlertMessageVariant } from '@/components/AlertMessage';
import { Flex } from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import { ModalFooter } from '@/components/LegacyModal';
import { BlockText, Link, Text } from '@/components/Text';
import { GoogleStageType } from '@/constants/platforms';
import { useAsyncMountUnmount, useSmartReducerV2 } from '@/hooks';
import UploadPopup from '@/pages/Canvas/header/ActionGroup/components/UploadPopup';
import { Container, DropdownContainer } from '@/pages/Collaborators/components/InviteByLink/components';

import { ButtonLink, LoaderStage, ProjectItem, StageContainer } from '../components';

const Footer = ModalFooter as React.FC<any>;

type WaitProjectStageProps = {
  open?: boolean;
  onClose?: () => void;
  updateCurrentStage: (googleProjectID: string) => void;
  cancel: () => void;
};

const WaitProjectStage: React.FC<WaitProjectStageProps> = ({ updateCurrentStage, cancel, open, onClose }) => {
  const [projects, setProjects] = React.useState<{ id: string; name?: string }[]>([]);

  const [state, api] = useSmartReducerV2({
    error: false,
    loading: true,
  });

  useAsyncMountUnmount(async () => {
    try {
      const projectIDs = await client.platform.google.project.getGoogleProjects();

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

  return (
    <UploadPopup open={open!} onClose={onClose!} jobStage={GoogleStageType.WAIT_PROJECT} multiSelect={projects.length > 0}>
      {state.loading ? (
        <LoaderStage>Loading Projects</LoaderStage>
      ) : (
        <StageContainer>
          {/* eslint-disable-next-line no-nested-ternary */}
          {state.error ? (
            <StageContainer>
              <AlertMessage variant={AlertMessageVariant.DANGER} mb={0} mt={4}>
                Failed to retrieve projects for your Google developer account
              </AlertMessage>
            </StageContainer>
          ) : projects.length ? (
            <StageContainer noPadding>
              <Flex fullWidth height={42} mt={8} padding="12px 21px 10px 24px">
                <Text textAlign="left" mb={11} fontWeight={600} fontSize={15}>
                  Select Project
                </Text>
              </Flex>

              <Flex maxHeight={400} column style={{ overflow: 'auto' }}>
                {projects.map(({ id, name }) => (
                  <Flex key={id} fullWidth height={42} onClick={() => updateCurrentStage(id)}>
                    <ProjectItem>{name || id}</ProjectItem>
                  </Flex>
                ))}
              </Flex>
              <Flex
                fullWidth
                mt={9}
                height={68}
                padding="24px 60px"
                style={{ border: '1px solid #f9f9f9', overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                <Link href="https://console.actions.google.com/" onClick={cancel}>
                  Create New Project
                </Link>
              </Flex>
            </StageContainer>
          ) : (
            <StageContainer noPadding>
              <div style={{ padding: '24px 46px 24px 32px', textAlign: 'left' }}>
                <BlockText mb={15} fontSize={15} lineHeight="22px" color="#132144">
                  No projects exist on the Actions Console to connect to. Create a new project now.
                </BlockText>

                <Text color="#62778c" fontWeight={600}>
                  Steps:
                </Text>
                <ul>
                  <li>
                    <Text fontSize={14}>Click the 'Create Actions Project' button below</Text>
                  </li>
                  <li>
                    <Text fontSize={14}>Create a new project via 'Create Project' button</Text>
                  </li>
                  <li>
                    <Text fontSize={14}>Select 'Custom Project' type</Text>
                  </li>
                  <li>
                    <Text fontSize={14}>Select 'Black Project' template</Text>
                  </li>
                </ul>

                <BlockText mt={15} fontSize={15} lineHeight="22px" color="#132144">
                  Once complete, return to Voiceflow and click the upload button again to link your project.
                </BlockText>
              </div>

              <Footer>
                <Container>
                  <DropdownContainer>
                    <span>
                      <Link href="https://docs.voiceflow.com/#/quickstart/testable-links">The Tutorial</Link>
                    </span>
                  </DropdownContainer>
                  <ButtonLink href="https://console.actions.google.com/" onClick={cancel}>
                    <Button variant={ButtonVariant.PRIMARY}>Create Actions Project</Button>
                  </ButtonLink>
                </Container>
              </Footer>
            </StageContainer>
          )}
        </StageContainer>
      )}
    </UploadPopup>
  );
};

export default WaitProjectStage;
