import * as Realtime from '@voiceflow/realtime-sdk';
import { Dropdown, IconButton, IconButtonVariant, stopPropagation } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { ListChildComponentProps } from 'react-window';

import { TranscriptExportFormat } from '@/client/transcript';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useFeature, usePermission, useTrackingEvents } from '@/hooks';
import { useConfirmModal } from '@/hooks/modal.hook';
import { SystemTag } from '@/models';
import { ClassName } from '@/styles/constants';
import { isSentimentTag } from '@/utils/reportTag';

import { ListData } from '../../types';
import { Container, InfoSection, ReadStatusDot, StatusIcons } from './components';

const TranscriptResultsItem: React.FC<ListChildComponentProps<ListData>> = ({ data, index, style }) => {
  const { transcripts, currentTranscriptID } = data;
  const item = transcripts[index];
  const isLastItem = transcripts.length === index + 1;
  const { id, reportTags, unread, updatedAt, name, creatorID } = item;
  const isActive = String(currentTranscriptID) === String(id);

  const [trackingEvents] = useTrackingEvents();
  const [canDeleteTranscript] = usePermission(Permission.PROJECT_TRANSCRIPT_DELETE);
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);

  const confirmModel = useConfirmModal();

  const markAsRead = useDispatch(Transcript.markAsRead);
  const deleteTranscript = useDispatch(Transcript.deleteTranscript);
  const exportTranscript = useDispatch(Transcript.exportTranscript);
  const goToTargetTranscript = useDispatch(Router.goToTargetTranscript);

  const goToTarget = () => {
    goToTargetTranscript(id);
  };

  const onDelete = () => {
    confirmModel.openVoid({
      body: 'Are you sure you want to delete this conversation?',
      header: 'Delete Conversation',
      confirmButtonText: 'Delete',

      confirm: async () => {
        await deleteTranscript(id);

        trackingEvents.trackConversationDeleted();

        if (transcripts.length) goToTargetTranscript(transcripts[0].id);
      },
    });
  };

  const onExport = async () => {
    await exportTranscript(TranscriptExportFormat.CSV, id, name);

    trackingEvents.trackConversationExported();
  };

  const [sentiment, isSaved, isReviewed] = React.useMemo(
    () =>
      [
        reportTags.find(isSentimentTag),
        reportTags.includes(SystemTag.SAVED),
        reportTags.includes(SystemTag.REVIEWED),
      ] as const,
    [reportTags]
  );

  React.useEffect(() => {
    if (isActive && unread) {
      markAsRead(id);
    }
  }, [isActive]);

  return (
    <div style={style}>
      <Dropdown
        options={[
          hideExports.isEnabled ? null : { value: 'export', label: 'Export', onClick: onExport },
          ...(canDeleteTranscript ? [{ value: 'delete', label: 'Delete', onClick: onDelete }] : []),
        ]}
      >
        {({ ref, onToggle, isOpen }) => (
          <Container
            id={id}
            active={isActive}
            onClick={goToTarget}
            menuOpen={isOpen}
            className={cn(ClassName.TRANSCRIPT_ITEM, { active: isActive })}
            isLastItem={isLastItem}
          >
            <ReadStatusDot read={!unread} />

            <InfoSection
              active={isActive}
              name={name}
              userId={creatorID}
              date={updatedAt}
              isRead={!unread}
              tags={reportTags}
            />

            <div className={ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON}>
              <IconButton
                icon="ellipsis"
                variant={IconButtonVariant.SUBTLE}
                size={15}
                onClick={stopPropagation(onToggle)}
                ref={ref}
              />
            </div>

            {!isOpen && <StatusIcons id={id} reviewed={isReviewed} saved={isSaved} sentiment={sentiment} />}
          </Container>
        )}
      </Dropdown>
    </div>
  );
};

export default React.memo(TranscriptResultsItem);
