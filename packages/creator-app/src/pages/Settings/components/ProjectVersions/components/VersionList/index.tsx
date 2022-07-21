import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlexCenter, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { noIntentsGraphic } from '@/assets';
import { VersionTag } from '@/constants/platforms';
import { useFeature } from '@/hooks';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions';

import { TableContainer, TableHeader } from './components';
import VersionItem from './components/VersionItem';
import V1VersionItem from './components/VersionItem/V1VersionItem';

interface VersionListProps {
  versions: ProjectVersion[];
  swapVersions: (versionID: string) => Promise<void>;
  fetchVersions: () => void;
  liveVersion?: string;
  activeVersionID: string | null;
}

const VersionList: React.FC<VersionListProps> = ({ liveVersion, activeVersionID, versions, swapVersions, fetchVersions }) => {
  const infiniteScrollRef = React.useRef<HTMLDivElement>(null);
  const loadMore = useOnScreen(infiniteScrollRef);

  const canUsePVM = useFeature(Realtime.FeatureFlag.PRODUCTION_VERSION_MANAGEMENT);

  React.useEffect(() => {
    if (loadMore) {
      fetchVersions();
    }
  }, [loadMore]);

  const VersionList = canUsePVM.isEnabled ? (
    <TableContainer columns={[2, 6, 3, 2, 1]}>
      <TableHeader>
        <span>Date</span>
        <span>Name</span>
        <span>User</span>
        <span>{/* dummy span */}</span>
        <span>{/* dummy span */}</span>
      </TableHeader>
      {versions.map((version) => (
        <VersionItem
          creatorID={version.creatorID}
          version={version}
          key={version.versionID}
          swapVersions={swapVersions}
          restoreEnabled={activeVersionID !== version.versionID}
          tag={version.versionID === liveVersion ? VersionTag.PRODUCTION : VersionTag.DEVELOPMENT}
        />
      ))}
    </TableContainer>
  ) : (
    <TableContainer columns={[3, 5, 4, 4]}>
      <TableHeader>
        <span>Date</span>
        <span>Name</span>
        <span>User</span>
        <span style={{ textAlign: 'right' }}>Actions</span>
      </TableHeader>
      {versions.map((version) => (
        <V1VersionItem
          creatorID={version.creatorID}
          version={version}
          key={version.versionID}
          restoreEnabled={activeVersionID !== version.versionID}
          swapVersions={swapVersions}
        />
      ))}
    </TableContainer>
  );

  return (
    <>
      {versions.length ? (
        VersionList
      ) : (
        <BoxFlexCenter textAlign="center" minHeight={400} style={{ borderTop: 'solid 1px #dfe3ed' }}>
          <div>
            <img src={noIntentsGraphic} height={64} alt="no intents" />
            <Box mt={10}>No versions exist</Box>
          </div>
        </BoxFlexCenter>
      )}
      <div ref={infiniteScrollRef} />
    </>
  );
};

export default VersionList;
