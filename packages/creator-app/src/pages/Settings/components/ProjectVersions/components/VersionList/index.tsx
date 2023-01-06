import { Box, BoxFlexCenter, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { noIntentsGraphic } from '@/assets';
import { VersionTag } from '@/constants/platforms';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions';

import { TableContainer, TableHeader } from './components';
import VersionItem from './components/VersionItem';

interface VersionListProps {
  versions: ProjectVersion[];
  swapVersions: (versionID: string) => Promise<void>;
  fetchVersions: () => void;
  liveVersion?: string;
  activeVersionID: string | null;
}

const VersionList: React.OldFC<VersionListProps> = ({ liveVersion, activeVersionID, versions, swapVersions, fetchVersions }) => {
  const infiniteScrollRef = React.useRef<HTMLDivElement>(null);
  const loadMore = useOnScreen(infiniteScrollRef);

  React.useEffect(() => {
    if (loadMore) {
      fetchVersions();
    }
  }, [loadMore]);

  return (
    <>
      {versions.length ? (
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
