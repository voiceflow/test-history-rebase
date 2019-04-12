import React from 'react';
import { getDevice } from 'Helper'
import serializeError from "serialize-error";
import axios from 'axios'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        }
    }


    componentDidCatch(error, info){
        error = serializeError(error)
        axios.post('/errors', {
            name: error.name,
            message: error.message,
            error: error.stack,
            componentTree: info.componentStack,
            browser: getDevice(),
            user_detail: window.user_detail,
        })
        this.setState({
            hasError: true,
        });
    }

    render() {
        if (this.state.hasError){
            return (<div className="h-100 w-100 super-center">
                <div className="text-center">
                    <h1>Whoops, something went wrong, please return to home</h1>
                    <Link to="/" className="btn btn-primary mt-3"><i className="far fa-long-arrow-left mr-2" />Home</Link>
                </div>
            </div>)
        }
        return this.props.children;
    }
}

export default ErrorBoundary