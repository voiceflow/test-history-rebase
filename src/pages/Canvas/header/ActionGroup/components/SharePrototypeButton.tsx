import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useEnableDisable, useFeature, usePermission, useTrackingEvents } from '@/hooks';
import { ConnectedProps } from '@/types';
import { copy } from '@/utils/clipboard';

const SharePrototypeButton: React.FC<ConnectedSharePrototypeButtonProps> = ({ sharePrototype, renderPrototype, renderPrototypeV2 }) => {
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [isCopied, setCopiedStatus, clearCopiedStatus] = useEnableDisable();
  const [trackingEvents] = useTrackingEvents();
  const [testableLink, setTestableLink] = React.useState('');

  const loadTestableLink = async () => {
    if (testableLink) {
      return;
    }

    const demoID = await sharePrototype();

    setTestableLink(`${window.location.origin}/demo/${demoID}`);
  };

  const copyTestableLink = () => {
    copy(testableLink);
    setCopiedStatus();
  };

  const onClickPrototype = () => {
    if (dataRefactor.isEnabled) {
      renderPrototypeV2({ aborted: false });
    } else {
      renderPrototype();
    }
    copyTestableLink();
    trackingEvents.trackActiveProjectTestableLinkShare();
    toast.success('Link copied to clipboard.');
  };

  React.useEffect(() => {
    loadTestableLink();
  }, []);

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(clearCopiedStatus, 1000);
    }
  }, [isCopied]);

  return canSharePrototype ? (
    <Button variant={ButtonVariant.PRIMARY} icon="link" onClick={onClickPrototype}>
      Share Prototype
    </Button>
  ) : null;
};

const mapDispatchToProps = {
  sharePrototype: Prototype.sharePrototype,
  renderPrototype: Prototype.renderPrototype,
  renderPrototypeV2: Prototype.renderPrototypeV2,
};

type ConnectedSharePrototypeButtonProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SharePrototypeButton);
