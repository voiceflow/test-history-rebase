import React, { Component } from 'react';
import { connect } from 'react-redux';
import {closeCanvasError} from 'actions/userActions';

class CanvasWarning extends Component {
    componentDidMount(){
        const duration = 5000;
        this.timeout = setTimeout(() => {
            this.props.closeCanvasError(0);
        }, duration)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }
    render(){
        return(
                <div className='canvas-warning'>
                    <img className="float-left mt-3 mb-3 ml-2 mr-2" src={"/yellow-error.svg"} alt="error"/>
                    <div className="float-right mr-1 mt-1 close-warning" onClick={() => this.props.closeCanvasError(this.props.idx)}>x</div>
                    <div className="pt-3 pb-3">{`${this.props.err}`}</div>
                </div>
        )
    }
}

const mapStateToProps = state => ({
    canvasError: state.userSetting.canvasError,
})

const mapDispatchToProps = dispatch => {
    return {
        closeCanvasError: (err) => dispatch(closeCanvasError(err))
    }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasWarning);