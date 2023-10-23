import { Box, Spinner, useOnScreenCallback } from '@voiceflow/ui';
import React from 'react';

import { noIntentsGraphic } from '@/assets';
import { VersionTag } from '@/constants/platforms';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions';

import { TableContainer, TableHeader } from './components';
import VersionItem from './components/VersionItem';

interface VersionListProps {
  versions: ProjectVersion[];
  onLoadMore: VoidFunction;
  liveVersion?: string;
  loadingMore?: boolean;
  swapVersions: (versionID: string) => Promise<void>;
  noMoveVersions?: boolean;
  activeVersionID: string | null;
}

const VersionList: React.FC<VersionListProps> = ({
  versions,
  onLoadMore,
  loadingMore,
  liveVersion,
  swapVersions,
  noMoveVersions,
  activeVersionID,
}) => {
  const infiniteScrollRef = React.useRef<HTMLDivElement>(null);

  useOnScreenCallback(infiniteScrollRef, (entry) => entry.isIntersecting && onLoadMore());

  return versions.length ? (
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

      {!noMoveVersions &&
        (loadingMore ? (
          <Box.FlexCenter pt={20} minHeight={50}>
            <Spinner isMd borderLess fillContainer />
          </Box.FlexCenter>
        ) : (
          <div ref={infiniteScrollRef} />
        ))}
    </TableContainer>
  ) : (
    <Box.FlexCenter textAlign="center" minHeight={400} style={{ borderTop: 'solid 1px #dfe3ed' }}>
      <div>
        <img src={noIntentsGraphic} height={64} alt="no intents" />
        <Box mt={10}>No versions exist</Box>
      </div>
    </Box.FlexCenter>
  );
};

export default VersionList;
