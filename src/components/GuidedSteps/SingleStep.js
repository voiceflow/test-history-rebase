import './SingleStep.css';

import React from 'react';

import SingleStepWrapper from './SingleStepWrapper';

class SingleStep extends React.PureComponent {
  containerRef = React.createRef();

  state = {
    height: null,
  };

  componentDidMount() {
    this.setState({ height: this.containerRef.current.scrollHeight });
  }

  render() {
    const { children } = this.props;

    return (
      <>
        <SingleStepWrapper height={this.state.height} isActive={this.props.active} ref={this.containerRef}>
          {children}
        </SingleStepWrapper>
      </>
    );
  }
}

export default SingleStep;
