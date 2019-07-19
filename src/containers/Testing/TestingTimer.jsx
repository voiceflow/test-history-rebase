import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';

import { TEST_STATUS } from '../../ducks/test';

class TestTimer extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentDidUpdate() {
    if (this.props.status === TEST_STATUS.ENDED) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <label>{moment.utc(this.props.time && Date.now() - this.props.time * 1000).format('mm:ss')}</label>;
  }
}
const mapStateToProps = (state) => ({
  time: state.test.startTime,
  status: state.test.status,
});

export default connect(mapStateToProps)(TestTimer);
