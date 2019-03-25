import React, { Component } from 'react'
import axios from 'axios'
import ModuleCard from './ModuleCard'
import Masonry from 'react-masonry-component'
import './Marketplace.css'
import { connect } from 'react-redux'
import ModuleModal from './../../components/Modals/ModuleModal'

class FlowMarket extends Component {
  constructor(props){
    super(props)

    this.state = {
      modules: [],
      curr_module: null
    }

    this.onLoadModules = this.onLoadModules.bind(this)
    this.showModuleDetailView = this.showModuleDetailView.bind(this)
    this.toggleModalView = this.toggleModalView.bind(this)
  }

  onLoadModules(){
    axios.get(`/marketplace/${this.props.project_id}`)
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
  }

  componentDidMount(){
    this.onLoadModules()
  }

  showModuleDetailView(targ_module){
    this.setState({
      curr_module: targ_module
    })  
  }

  toggleModalView(){
    if(this.state.curr_module){
      this.setState({
        curr_module: null
      })
    }
  }

  render() {
    return (
      <div className="marketplace-window">
        <ModuleModal
          isOpen={this.state.curr_module !== null} 
          toggle={this.toggleModalView}
          module={this.state.curr_module}
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

const mapStateToProps = state => ({
  project_id: state.skills.skill.project_id
})

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowMarket)