import { Box, SectionV2, System, useOnScreenCallback } from '@voiceflow/ui';
import React from 'react';

import { designerClient } from '@/client/designer';
import { Spinner } from '@/components/legacy/Spinner';
import * as Settings from '@/components/Settings';
import { LEGACY_VERSIONS } from '@/config/documentation';
import * as Session from '@/ducks/session';
import { useSetup, useTrackingEvents } from '@/hooks';
import { useSelector } from '@/hooks/redux';

import EnvironmentItem from './EnvironmentItem';
import { useProjectVersions } from './hooks';
import LegacyVersionItem from './LegacyVersionItem';
import * as S from './styles';
import { EnvironmentRef } from './types';

const Loading = (
  <Box.FlexCenter pt={20} minHeight={50}>
    <Spinner isMd borderLess fillContainer />
  </Box.FlexCenter>
);

const ProjectEnvironments: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const [environmentRefs, setEnvironmentRefs] = React.useState<EnvironmentRef[]>([]);
  const [loadingEnvironments, setLoadingEnvironments] = React.useState(true);

  const [trackingEvents] = useTrackingEvents();

  const { versionList, fetchInitialVersions, noMoreVersions, loadingMore, onLoadMore, initialFetching, deleteVersion } =
    useProjectVersions(projectID);

  const versions = React.useMemo(
    () => versionList.filter((version) => !environmentRefs.find((ref) => ref.environment._id === version.versionID)),
    [versionList, environmentRefs]
  );

  const infiniteScrollRef = React.useRef<HTMLDivElement>(null);

  useOnScreenCallback(infiniteScrollRef, (entry) => entry.isIntersecting && onLoadMore());

  useSetup(async () => {
    trackingEvents.trackActiveProjectVersionPage();

    fetchInitialVersions();

    setEnvironmentRefs(await designerClient.assistant.findEnvironments(projectID));
    setLoadingEnvironments(false);
  });

  return (
    <>
      <Settings.Section title="Environments">
        <Settings.Card>
          <S.TableContainer columns={[3, 4, 3, 2]}>
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

      {!loadingEnvironments && versions.length > 0 && (
        <Settings.Section title="Legacy Versions">
          <Settings.Card>
            <S.Heading>
              Legacy versions are environments that should not longer be referenced or used. Convert them to backups.{' '}
              <System.Link.Anchor href={LEGACY_VERSIONS}>Learn more.</System.Link.Anchor>
            </S.Heading>
            <SectionV2.Divider />
            <S.TableContainer columns={[3, 4, 3, 2]}>
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
                  projectID={projectID}
                  deleteVersion={() => deleteVersion(version.versionID)}
                />
              ))}

              {!noMoreVersions && (loadingMore || initialFetching ? Loading : <div ref={infiniteScrollRef} />)}
            </S.TableContainer>
          </Settings.Card>
        </Settings.Section>
      )}
    </>
  );
};

export default ProjectEnvironments;
