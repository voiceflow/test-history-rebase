import React from 'react';

import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions';

import { TableContainer, TableHeader } from './components';
import VersionItem from './components/VersionItem';

interface VersionListProps {
  versions: ProjectVersion[];
  swapVersions: (versionID: string) => void;
}

const VersionList: React.FC<VersionListProps> = ({ versions, swapVersions }) => {
  return (
    <TableContainer columns={[3, 5, 4, 4]} minHeight={320}>
      <TableHeader>
        <span>Date</span>
        <span>Name</span>
        <span>User</span>
        <span style={{ textAlign: 'right' }}>Actions</span>
      </TableHeader>
      {versions.map((version) => (
        <VersionItem creatorID={version.creatorID} version={version} key={version.versionID} swapVersions={swapVersions} />
      ))}
    </TableContainer>
  );
};

export default VersionList;
