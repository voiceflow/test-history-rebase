import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

class Templates extends Component {

    constructor(props) {
        super(props);

        this.state = {
            templates: [],
            loading: true
        }
    }

    render() {
        if(this.state.loading){
            return <div className="super-center h-100 w-100">Loading...</div>
        }

        return 'YEet'
    }
}

export default Templates;
