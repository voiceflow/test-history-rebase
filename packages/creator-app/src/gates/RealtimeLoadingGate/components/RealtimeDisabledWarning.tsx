import { FlexCenter, PageError } from '@voiceflow/ui';
import React from 'react';
import { Link } from 'react-router-dom';

import { supportGraphicSmall } from '@/assets';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const RealtimeDisabledWarning: React.FC<ConnectedRealtimeDisabledWarningProps> = ({ goToDashboard }) => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <PageError
      icon={<img src={supportGraphicSmall} alt="" />}
      title="Browser Not Supported"
      message="Your browser can't support real-time collaboration."
    >
      <Link to="" onClick={goToDashboard} className="btn btn-primary mt-3">
        Dashboard
      </Link>
    </PageError>
  </FlexCenter>
);

const mapDispatchToProps = {
  goToDashboard: Router.goToDashboard,
};

type ConnectedRealtimeDisabledWarningProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(RealtimeDisabledWarning);
