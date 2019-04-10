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
                    <img className="mr-3" src={"/yellow-error.svg"} alt="error"/>
                    <div className="text-left w-100">{`${this.props.err}`}</div>
                    <div className="close pl-1" onClick={() => this.props.closeCanvasError(this.props.idx)}></div>
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