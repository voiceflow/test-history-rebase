import React from 'react';
import { Link } from 'react-router-dom';

import Error from '@/components/ErrorPages/Error';
import { FlexCenter } from '@/components/Flex';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';

const RealtimeDisabledWarning = ({ goToDashboard }) => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <Error icon={<img src="/Support.svg" alt="" />} title="Browser Not Supported" message="Your browser can't support real-time collaboration.">
      <Link to="" onClick={goToDashboard} className="btn btn-primary mt-3">
        Dashboard
      </Link>
    </Error>
  </FlexCenter>
);

const mapDispatchToProps = {
  goToDashboard: Router.goToDashboard,
};

export default connect(null, mapDispatchToProps)(RealtimeDisabledWarning);
