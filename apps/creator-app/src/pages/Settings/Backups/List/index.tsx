import type { Backup } from '@voiceflow/dtos';
import { Box, Spinner, useOnScreenCallback } from '@voiceflow/ui';
import React from 'react';

import { noIntentsGraphic } from '@/assets';

import BackupItem from './Item';
import * as S from './styles';

interface BackupsListProps {
  data: Backup[];
  onDelete: (backup: Backup) => Promise<void>;
  onRestore: (backup: Backup) => Promise<void>;
  onDownload: (backup: Backup) => Promise<void>;
  onLoadMore: VoidFunction;
  loadingMore?: boolean;
  hasMore?: boolean;
}

const BackupsList: React.FC<BackupsListProps> = ({ data, onDelete, onRestore, onDownload, onLoadMore, loadingMore, hasMore }) => {
  const infiniteScrollRef = React.useRef<HTMLDivElement>(null);

  useOnScreenCallback(infiniteScrollRef, (entry) => entry.isIntersecting && onLoadMore());

  return data.length ? (
    <S.TableContainer columns={[2, 6, 3, 2, 1]}>
      <S.TableHeader>
        <span>Date</span>
        <span>Name</span>
        <span>User</span>
        <span>{/* dummy span */}</span>
      </S.TableHeader>

      {data.map((backup) => (
        <BackupItem
          key={backup.id}
          backup={backup}
          creatorID={backup.createdByID}
          onRestore={onRestore}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}

      {hasMore &&
        (loadingMore ? (
          <Box.FlexCenter pt={20} minHeight={50}>
            <Spinner isMd borderLess fillContainer />
          </Box.FlexCenter>
        ) : (
          <div ref={infiniteScrollRef} />
        ))}
    </S.TableContainer>
  ) : (
    <Box.FlexCenter textAlign="center" minHeight={400} style={{ borderTop: 'solid 1px #dfe3ed' }}>
      <div>
        <img src={noIntentsGraphic} height={64} alt="no intents" />
        <Box mt={10}>No backups exist</Box>
      </div>
    </Box.FlexCenter>
  );
};

export default BackupsList;
