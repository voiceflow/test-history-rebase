import { Box, useOnScreen } from '@voiceflow/ui';
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

const VersionList: React.FC<VersionListProps> = ({ liveVersion, activeVersionID, versions, swapVersions, fetchVersions }) => {
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
              tag={version.versionID === liveVersion ? VersionTag.PRODUCTION : VersionTag.DEVELOPMENT}
              key={version.versionID}
              version={version}
              creatorID={version.creatorID}
              swapVersions={swapVersions}
              restoreEnabled={activeVersionID !== version.versionID}
            />
          ))}
        </TableContainer>
      ) : (
        <Box.FlexCenter textAlign="center" minHeight={400} style={{ borderTop: 'solid 1px #dfe3ed' }}>
          <div>
            <img src={noIntentsGraphic} height={64} alt="no intents" />
            <Box mt={10}>No versions exist</Box>
          </div>
        </Box.FlexCenter>
      )}
      <div ref={infiniteScrollRef} />
    </>
  );
};

export default VersionList;
