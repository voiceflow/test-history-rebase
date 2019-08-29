import _ from 'lodash';
import React, { PureComponent } from 'react';

import Progress from '@/components/Progress';
import { Spinner } from '@/components/Spinner';

import { UploadPromptWrapper } from '../styled';

export const IndefiniteLoading = ({ message }) => (
  <UploadPromptWrapper>
    <div className="text-center mt-2">
      <Spinner isEmpty />
    </div>
    <div className="text-center mb-3">
      <p className="mb-0">{message}</p>
    </div>
  </UploadPromptWrapper>
);

export class ProgressLoading extends PureComponent {
  state = {
    percent: 0,
  };

  componentDidMount() {
    this.updateInterval();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.state !== this.props.state) {
      this.updateInterval();
    }
  }

  updateInterval = () => {
    const { state } = this.props;
    if (state && state.loading) {
      const { start, end, time } = state.loading;
      if (!_.isInteger(start) || !_.isInteger(end) || !_.isInteger(time)) return;
      clearInterval(this.timeout);

      const interval = Math.floor(time / Math.abs(end - start));
      this.setState({ percent: start });
      this.increment(end, interval);
    }
  };

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  // Step 8 - used in Step 7
  increment = (limit, interval) => {
    const { percent } = this.state;
    if (percent <= limit) {
      this.setState({ percent: percent + 1 });
      this.timeout = setTimeout(() => this.increment(limit, interval), interval);
    }
  };

  render() {
    const { percent } = this.state;
    const label = _.get(this.props.state, ['loading', 'label']);

    return (
      <UploadPromptWrapper>
        <div className="mt-2" />
        <Progress type="circle" strokeWidth={5} theme={{ default: { color: '#42a5ff' } }} percent={percent} />
        {label && (
          <div className="text-center my-3">
            <p className="mb-0">{label}</p>
          </div>
        )}
      </UploadPromptWrapper>
    );
  }
}
