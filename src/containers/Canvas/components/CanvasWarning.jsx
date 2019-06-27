import { closeCanvasError } from 'ducks/user';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class CanvasWarning extends Component {
  componentDidMount() {
    const duration = 5000;
    this.timeout = setTimeout(() => {
      this.props.closeCanvasError(0);
    }, duration);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <div className="canvas-warning">
        <img className="mr-3" src={this.props.err.icon} alt="error" />
        <div className="text-left w-100">{`${this.props.err.msg}`}</div>
        <div className="close pl-1" onClick={() => this.props.closeCanvasError(this.props.idx)} />
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
