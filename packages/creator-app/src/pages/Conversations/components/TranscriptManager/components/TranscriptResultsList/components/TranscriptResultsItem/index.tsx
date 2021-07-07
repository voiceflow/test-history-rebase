import { Dropdown } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Transcript from '@/ducks/transcript';
import { connect } from '@/hocs';
import { useDispatch, usePermission } from '@/hooks';
import { Sentiment, SentimentArray, SystemTag } from '@/models';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container, InfoSection, OptionButton, ReadStatusDot, StatusIcons } from './components';

interface ResultsItem {
  active?: boolean;
  data: any;
}

const TranscriptResultsItem: React.FC<ConnectTranscriptResultsItemProps & ResultsItem> = ({ goToTargetTranscript, data, active = false }) => {
  const { id, tags, unread, created_at, name } = data;
  const isSaved = tags.includes(SystemTag.SAVED);
  const isReviewed = tags.includes(SystemTag.REVIEWED);
  const sentiment = tags.filter((tag: string) => SentimentArray.includes(tag as Sentiment))[0];

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [canDeleteTranscript] = usePermission(Permission.DELETE_TRANSCRIPT);
  const markAsRead = useDispatch(Transcript.markAsRead);
  const deleteTranscript = useDispatch(Transcript.deleteTranscript);
  const confirmDelete = useDispatch(Modal.setConfirm);

  React.useEffect(() => {
    if (active && unread) {
      markAsRead(id);
    }
  }, [active]);

  const goToTarget = () => {
    goToTargetTranscript(id);
  };

  const onDelete = () => {
    confirmDelete({
      warning: false,
      text: 'Are you sure you want to delete this conversation?',
      confirm: () => deleteTranscript(id),
    });
  };

  const onExport = () => {
    alert('Exported');
  };

  const options = React.useMemo(() => {
    return canDeleteTranscript
      ? [
          {
            value: 'export',
            label: 'Export',
            onClick: onExport,
          },
          {
            value: 'delete',
            label: 'Delete',
            onClick: onDelete,
          },
        ]
      : [
          {
            value: 'export',
            label: 'Export',
            onClick: onExport,
          },
        ];
  }, [canDeleteTranscript, id]);

  return (
    <Container id={id} menuOpen={menuOpen} active={active} onClick={goToTarget}>
      <ReadStatusDot read={!unread} />
      <InfoSection name={name} date={created_at} isRead={!unread} tags={tags} />
      <div className={ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON}>
        <Dropdown options={options}>
          {(ref, onToggle, isOpen) => {
            return <OptionButton ref={ref} onToggle={onToggle} isOpen={isOpen} setMenuOpen={setMenuOpen} />;
          }}
        </Dropdown>
      </div>
      {!menuOpen && <StatusIcons id={id} reviewed={isReviewed} saved={isSaved} sentiment={sentiment} />}
    </Container>
  );
};

const mapStateToProps = {
  activeProjectID: Session.activeProjectIDSelector,
};
const mapDispatchToProps = {
  goToTargetTranscript: Router.goToTargetTranscript,
};

type ConnectTranscriptResultsItemProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptResultsItem) as React.FC<ResultsItem>;
