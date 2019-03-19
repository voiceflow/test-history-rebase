import React, { Component } from 'react'
import axios from 'axios';
import ModuleCard from './ModuleCard';
import BannerCarousel from './BannerCarousel';
import Masonry from 'react-masonry-component';
import './Marketplace.css';
import { ButtonGroup } from 'reactstrap';

class FlowMarket extends Component {
  constructor(props){
    super(props)

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

    this.onLoadModules = this.onLoadModules.bind(this)
    this.showModuleDetailView = this.showModuleDetailView.bind(this)
  }

  onLoadModules(){
    axios.get('/marketplace')
    .then(res => {
      let modules = res.data.filter(module => module.type === 'FLOW')
      this.setState({
        modules: modules,
        loading: false
      })
    })
    .catch(err => {
      console.log(err)
    })

    axios.get('/marketplace/featured')
    .then(res => {
        this.setState({
            featured_modules: res.data,
            loading: false
        })
    })
    .catch(error => {
        console.log(error)
    })

    axios.get('/marketplace/user_module')
    .then(res => {
      let user_modules = new Set(user_modules)
      this.setState({
        user_modules: user_modules,
        loading: false
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  componentDidMount(){
    this.onLoadModules()
  }

  showModuleDetailView(){
    console.log('k')
  }

  render() {
    return (
      <div className="marketplace-window">
        <BannerCarousel
          featured_modules={this.state.featured_modules}
          ownership={this.state.user_modules}
          onOwnershipChange={this.handleOwnershipChange}
        />
        <Masonry elementType='div' className="skills-container">
          {this.state.modules.map((module, i) => 
            <ModuleCard
              key={i}
              module={module}
              showModuleDetailView={this.showModuleDetailView}
              onClick={() => {this.props.history.push('/market/' + module.module_id)}}
              ownership={this.state.user_modules}
              onOwnershipChange={this.handleOwnershipChange}
            />
          )}
        </Masonry>
      </div>
    )
  }
}

export default FlowMarket