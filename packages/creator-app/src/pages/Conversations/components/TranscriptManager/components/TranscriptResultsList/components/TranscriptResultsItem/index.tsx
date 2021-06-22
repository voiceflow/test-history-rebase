import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { Permission } from '@/config/permissions';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { Sentiment, SentimentArray, SystemTag } from '@/models';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { stopPropagation } from '@/utils/dom';

import { Container, InfoSection, ReadStatusDot, StatusIcons } from './components';

interface ResultsItem {
  active?: boolean;
  data: any;
}

const TranscriptResultsItem: React.FC<ConnectTranscriptResultsItemProps & ResultsItem> = ({ goToTargetTranscript, data, active = false }) => {
  const { id, tags, unread, date, name } = data;
  const isSaved = tags.includes(SystemTag.SAVED);
  const isReviewed = tags.includes(SystemTag.REVIEWED);
  const sentiment = tags.filter((tag: string) => SentimentArray.includes(tag as Sentiment))[0];

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [canDeleteTranscript] = usePermission(Permission.DELETE_TRANSCRIPT);

  const goToTarget = () => {
    setMenuOpen(!menuOpen);
    goToTargetTranscript(id);
  };

  const onDelete = () => {
    alert('Deleted');
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
  }, [canDeleteTranscript]);

  return (
    <Container id={id} menuOpen={menuOpen} active={active} onClick={goToTarget}>
      <ReadStatusDot read={!unread} />
      <InfoSection name={name} date={date} isRead={!unread} tags={tags} />
      <div className={ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON}>
        <Dropdown options={options}>
          {(ref, onToggle, isOpen) => {
            return (
              <IconButton icon="elipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={stopPropagation(onToggle)} ref={ref} />
            );
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
