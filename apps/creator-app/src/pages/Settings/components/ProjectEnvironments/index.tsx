import { Box, SectionV2, Spinner, System, useOnScreenCallback } from '@voiceflow/ui';
import React from 'react';

import { designerClient } from '@/client/designer';
import * as Settings from '@/components/Settings';
import * as Session from '@/ducks/session';
import { useSetup, useTrackingEvents } from '@/hooks';
import { useSelector } from '@/hooks/redux';
import { Heading } from '@/pages/Settings/components/ProjectVersions/components';
import * as S from '@/pages/Settings/components/ProjectVersions/components/VersionList/components';
import { useProjectVersions } from '@/pages/Settings/components/ProjectVersions/hooks';

import EnvironmentItem from './EnvironmentItem';
import LegacyVersionItem from './LegacyVersionItem';
import { EnvironmentRef } from './types';

const Loading = (
  <Box.FlexCenter pt={20} minHeight={50}>
    <Spinner isMd borderLess fillContainer />
  </Box.FlexCenter>
);

const ProjectEnvironments: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const [environmentRefs, setEnvironmentRefs] = React.useState<EnvironmentRef[]>([]);
  const [loadingEnvironments, setLoadingEnvironments] = React.useState(true);

  const [trackingEvents] = useTrackingEvents();

  const { versionList, fetchInitialVersions, noMoreVersions, loadingMore, onLoadMore, initialFetching, deleteVersion } = useProjectVersions(
    projectID!
  );
  const versions = React.useMemo(
    () => versionList.filter((version) => !environmentRefs.find((ref) => ref.environment._id === version.versionID)),
    [versionList, environmentRefs]
  );

  const infiniteScrollRef = React.useRef<HTMLDivElement>(null);

  useOnScreenCallback(infiniteScrollRef, (entry) => entry.isIntersecting && onLoadMore());

  useSetup(async () => {
    trackingEvents.trackActiveProjectVersionPage();

    fetchInitialVersions();

    setEnvironmentRefs(await designerClient.assistant.findEnvironments(projectID!));
    setLoadingEnvironments(false);
  });

  return (
    <>
      <Settings.Section title="Environments">
        <Settings.Card>
          <S.TableContainer columns={[3, 9, 5, 3]}>
            <S.TableHeader>
              <span>Date</span>
              <span>Name</span>
              <span>User</span>
              <span />
            </S.TableHeader>
            {loadingEnvironments
              ? Loading
              : environmentRefs
                  .filter(({ tag }) => tag !== 'preview')
                  .map((environmentRef, index) => <EnvironmentItem key={index} environmentRef={environmentRef} />)}
          </S.TableContainer>
        </Settings.Card>
      </Settings.Section>

      <Settings.Section title="Legacy Versions">
        <Settings.Card>
          <Heading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum nibh in neque consequat rutrum.{' '}
            <System.Link.Anchor>Learn more.</System.Link.Anchor>
          </Heading>
          <SectionV2.Divider />
          <S.TableContainer columns={[3, 6, 3, 1]}>
            <S.TableHeader>
              <span>Date</span>
              <span>Name</span>
              <span>User</span>
              <span>{/* dummy span */}</span>
            </S.TableHeader>

            {versions.map((version) => (
              <LegacyVersionItem
                key={version.versionID}
                version={version}
                creatorID={version.creatorID}
                deleteVersion={() => deleteVersion(version.versionID)}
              />
            ))}

            {!noMoreVersions && (loadingMore || initialFetching ? Loading : <div ref={infiniteScrollRef} />)}
          </S.TableContainer>
        </Settings.Card>
      </Settings.Section>
    </>
  );
};

export default ProjectEnvironments;
