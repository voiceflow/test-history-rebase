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
            featured_modules: [
				{ title: '',
				  descr:'',
                  card_icon: '',
                  module_id: ''},
				{ title: '',
				  descr:'',
                  card_icon: '',
                  module_id: ''}
			],
            loading: false,
            user_modules: new Set()
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
            this.setState({
                modules: res.data,
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
                        <Button>Flows</Button>
                        <Button>Templates</Button>
                    </ButtonGroup>
                </div>

                <div className="marketplace-main">
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
                </div>
            </div>
        );
    }
}

export default Marketplace;
