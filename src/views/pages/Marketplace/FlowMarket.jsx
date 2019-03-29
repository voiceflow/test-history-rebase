import React, { Component } from 'react'
import axios from 'axios'
import ModuleCard from './ModuleCard'
import Masonry from 'react-masonry-component'
import './Marketplace.css'
import { connect } from 'react-redux'
import ModuleModal from './../../components/Modals/ModuleModal'
import { Input } from 'reactstrap'

class FlowMarket extends Component {
  constructor(props){
    super(props)

    this.state = {
      modules: [],
      curr_module: null,
      show_module_modal: false,
      conflicts: [],
      loading: true
    }

    this.onLoadModules = this.onLoadModules.bind(this)
    this.showModuleDetailView = this.showModuleDetailView.bind(this)
    this.toggleModalView = this.toggleModalView.bind(this)
    this.hideModule = this.hideModule.bind(this)
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
      curr_module: targ_module,
      show_module_modal: true
    })  
  }

  toggleModalView(){
    this.setState((prev_state) => ({
      show_module_modal: !prev_state.show_module_modal
    }))
  }

  hideModule(module_id){
    let filtered_modules = this.state.modules.filter(module => module.module_id !== module_id)
    this.setState({
      modules: filtered_modules
    })
  }

  render() {
    return (
      <div className="marketplace-window justify-content-center">
        <ModuleModal
          isOpen={this.state.show_module_modal} 
          toggle={this.toggleModalView}
          module={this.state.curr_module}
          hideModule={this.hideModule}
        />

        <div className="flow-market-sidebar">
          <div className="flow-market-sidebar-bordered p-4">
            <h5>Flows</h5>
            <p>Flows act as pieces of functionality that you can add to your project. Here's a video on how it works!</p>
            <iframe width="160" height="100" src="https://www.youtube.com/embed/Dk_-DxyiQe4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>

          <div className="flow-market-sidebar-bordered mt-4">
            <Input className='search-input form-control-2' placeholder="Search Flows" onChange={(e) => this.onFilter("name", e.target)}/>
          </div>

          <div className="mt-4">
            <button className="btn btn-link flow-market-filter pl-0 pb-0 pt-0">Featured</button>
            <button className="btn btn-link flow-market-filter pl-0 pb-0">Most popular</button>
            <button className="btn btn-link flow-market-filter pl-0 pb-0">Onboarding</button>
            <button className="btn btn-link flow-market-filter pl-0 pb-0">Up-sell</button>
            <button className="btn btn-link flow-market-filter pl-0 pb-0">Ordering</button>
            <button className="btn btn-link flow-market-filter pl-0 pb-0">Booking</button>
            <button className="btn btn-link flow-market-filter pl-0 pb-0">Accounting</button>
            <button className="btn btn-link flow-market-filter pl-0 pb-0">Database</button>
          </div>
        </div>

        <Masonry 
          elementType='div' 
          className="module-container">
          {this.state.loading && <div className="text-center w-100 h-100"><span className="market-loader"/></div>}
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