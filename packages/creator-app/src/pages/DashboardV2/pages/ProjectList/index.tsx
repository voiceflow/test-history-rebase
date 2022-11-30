import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AssistantCardProps, Banner, Button } from '@voiceflow/ui';
import React from 'react';

import { AssistantCard } from '@/components/AssistantCard';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

import { AssistantLoadingGate } from '../../gates';
import Header from './components/Header';
import * as S from './styles';

const customProp = {
  title: 'Webchat - Book a Demo',
  status: 'By Voiceflow',
} as AssistantCardProps;

interface ProjectListProps {
  workspace: Realtime.Workspace | null;
}

const ProjectList: React.FC<ProjectListProps> = () => {
  const projects = useSelector(ProjectV2.allProjectsSelector);
  const goToAssistantOverview = useDispatch(Router.goToAssistantOverview);
  const goToCanvasWithVersionID = useDispatch(Router.goToCanvasWithVersionID);

  return (
    <>
      <Header onSearch={() => {}} />
      <S.ProjectListWrapper>
        <Banner
          title="Learn Voiceflow with video tutorials"
          subtitle="In this course you’ll find everything you need to get started with Voiceflow from the ground up."
          buttonText="Start Course"
          onClick={() => {}}
          p="0px 16px 32px"
        />
        {projects.map(
          (item) =>
            item && (
              <S.Item key={item?.id}>
                <AssistantCard
                  onClickCTA={() => goToCanvasWithVersionID(item.versionID)}
                  onClickLink={() => goToAssistantOverview(item.versionID)}
                  projectType={item?.type}
                  platformType={item?.platform}
                  userRole={UserRole.OWNER}
                  status="Active"
                  image={item?.image}
                  project={item}
                />
              </S.Item>
            )
        )}

        <S.Footer>
          <S.Title>Start with a template</S.Title>
          <S.Item>
            <AssistantCard {...customProp} platformType={Platform.Constants.PlatformType.WEBCHAT}>
              <Button squareRadius variant={Button.Variant.PRIMARY}>
                Copy Template
              </Button>
            </AssistantCard>
          </S.Item>
          <S.Item>
            <AssistantCard {...customProp} platformType={Platform.Constants.PlatformType.WHATSAPP}>
              <Button squareRadius variant={Button.Variant.PRIMARY}>
                Copy Template
              </Button>
            </AssistantCard>
          </S.Item>
          <S.Item>
            <AssistantCard {...customProp} platformType={Platform.Constants.PlatformType.MICROSOFT_TEAMS}>
              <Button squareRadius variant={Button.Variant.PRIMARY}>
                Copy Template
              </Button>
            </AssistantCard>
          </S.Item>
        </S.Footer>
      </S.ProjectListWrapper>
    </>
  );
};

export default withBatchLoadingGate(WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate, AssistantLoadingGate)(ProjectList);
