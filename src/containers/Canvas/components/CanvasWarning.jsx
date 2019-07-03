import { closeCanvasError } from 'ducks/user';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class CanvasWarning extends Component {
  componentDidMount() {
    const { closeCanvasError } = this.props;
    const duration = 5000;
    this.timeout = setTimeout(() => {
      closeCanvasError(0);
    }, duration);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { err, closeCanvasError, idx } = this.props;
    return (
      <div className="canvas-warning">
        <img className="mr-3" src={err.icon} alt="error" />
        <div className="text-left w-100">{`${err.msg}`}</div>
        <div className="close pl-1" onClick={() => closeCanvasError(idx)} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  canvasError: state.userSetting.canvasError,
});

const mapDispatchToProps = (dispatch) => {
  return {
    closeCanvasError: (err) => dispatch(closeCanvasError(err)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasWarning);
