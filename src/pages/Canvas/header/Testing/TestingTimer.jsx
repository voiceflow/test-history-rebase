import moment from 'moment';
import React from 'react';

import { TEST_STATUS, testStatusSelector, testTimeSelector } from '@/ducks/test';
import { connect } from '@/hocs';

import { Timer } from './styled';

// TODO: need to redo the interval/state system here that Edwin impemented
class TestTimer extends React.PureComponent {
  componentDidUpdate({ status: prevStatus }) {
    const { status } = this.props;
    if (status !== prevStatus) {
      if (this.props.status === TEST_STATUS.ACTIVE) {
        this.interval = setInterval(() => this.forceUpdate(), 1000);
      } else {
        clearInterval(this.interval);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { time } = this.props;
    return <Timer>{moment.utc(time ? Date.now() - time * 1000 : 0).format('mm:ss')}</Timer>;
  }
}

const mapStateToProps = {
  time: testTimeSelector,
  status: testStatusSelector,
};

export default connect(mapStateToProps)(TestTimer);
