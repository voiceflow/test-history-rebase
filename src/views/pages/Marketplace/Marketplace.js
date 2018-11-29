import React, { Component } from 'react';
import Module from './Module';
import BannerCarousel from './BannerCarousel';
import Masonry from 'react-masonry-component';
import './Marketplace.css';
import { ButtonGroup, Button } from 'reactstrap';

import axios from 'axios';

class Marketplace extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modules: [],
            templates: [],
            featured_modules: [
				{ title: '',
				  descr:'',
                  module_icon: '',
                  module_id: ''},
				{ title: '',
				  descr:'',
                  module_icon: '',
                  module_id: ''}
			],
            loading: false,
            user_modules: new Set(),
            curr_state: "FLOW"
        }

        this.onLoadModules = this.onLoadModules.bind(this);
        this.handleOwnershipChange = this.handleOwnershipChange.bind(this);
    }

    componentDidMount() {
        this.onLoadModules();
    }

    onLoadModules() {
        axios.get('/marketplace')
        .then(res => {
            let modules = [];
            let templates = [];
            for(var i =0;i < res.data.length; i++){
                if(res.data[i].type==="FLOW"){
                    modules.push(res.data[i]);
                } else {
                    templates.push(res.data[i]);
                }
            }
            this.setState({
                modules: modules,
                templates: templates,
                loading: false
            });
        })
        .catch( error => {
            console.log(error);
        });

        axios.get('/marketplace/featured')
        .then(res => {
            this.setState({
                featured_modules: res.data,
                loading: false
            });
        })
        .catch(error => {
            console.log(error);
        });

        axios.get('/marketplace/user_module')
        .then(res => {
            let user_modules = [];
            for(var i = 0;i < res.data.length;i++){
                user_modules.push(res.data[i].module_id);
            }
            user_modules = new Set(user_modules);
            this.setState({
                user_modules: user_modules,
                loading: false
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleOwnershipChange(ownership){
        this.setState({
            user_modules: ownership
        })
    }

    render() {
        return (
            <div className="Window">
                <div className="sidenav">
                    <ButtonGroup vertical>
                        {this.state.curr_state === 'FLOW'?
                        <React.Fragment>
                            <button className="active-btn" onClick={() => {this.setState({curr_state: "FLOW"})}}>Flows</button>
                            <button className="inactive-btn" onClick={() => {this.setState({curr_state: "TEMPLATE"})}}>Templates</button>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <button className="inactive-btn" onClick={() => {this.setState({curr_state: "FLOW"})}}>Flows</button>
                            <button className="active-btn" onClick={() => {this.setState({curr_state: "TEMPLATE"})}}>Templates</button>
                        </React.Fragment>
                        }
                    </ButtonGroup>
                </div>

                <div className="marketplace-main">
                    {this.state.curr_state === "FLOW"
                    ?
                    <React.Fragment>
                        <BannerCarousel
                            featured_modules={this.state.featured_modules}
                            ownership={this.state.user_modules}
                            onOwnershipChange={this.handleOwnershipChange}
                        />
                        <Masonry elementType='div' className="skills-container">
                            {this.state.modules.map((module, i) => 
                                <Module
                                    key={i}
                                    module={module}
                                    onClick={() => {this.props.history.push('/market/' + module.module_id)}}
                                    ownership={this.state.user_modules}
                                    onOwnershipChange={this.handleOwnershipChange}
                                />
                            )}
                        </Masonry>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <Masonry elementType='div' className="skills-container">
                            {this.state.templates.map((module, i) => 
                                <Module
                                    key={i}
                                    module={module}
                                    onClick={() => {this.props.history.push('/market/' + module.module_id)}}
                                    ownership={this.state.user_modules}
                                    onOwnershipChange={this.handleOwnershipChange}
                                />
                            )}
                        </Masonry>
                    </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default Marketplace;
