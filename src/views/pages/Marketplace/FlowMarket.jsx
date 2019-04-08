import React, { Component } from 'react'
import axios from 'axios'
import './Marketplace.css'
import { connect } from 'react-redux'
import ModuleModal from './../../components/Modals/ModuleModal'
import { ReactiveBase, DataSearch, ReactiveList, SingleDataList } from '@appbaseio/reactivesearch'
import { TAGS } from './tags'
import withRenderModuleIcon from '../../HOC/ModuleIcon'
import ModuleCard from './ModuleCard'
import Masonry from 'react-masonry-component'

const ESURL = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production' ? process.env['ELASTIC_SEARCH_HOST'] : 'http://localhost:9200')

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
    this.filterTags = this.filterTags.bind(this)
    this.renderModules = this.renderModules.bind(this)
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

  filterTags = (value, props) => {
    if(value !== null){
      return {
        query: {
            match: {
                tag: value
            }
        }
      }
    } else {
      return {
        query: {
          match_all: {}
        }
      }
    }
  }

  showModuleDetailView(targ_module){
    targ_module.module_id = targ_module._id
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

  renderModules(res){
    return (
      <Masonry elementType='div' className="flow-market-container">
        {res.results.map((module, i) => {
          if(this.props.user_modules === undefined || !this.props.user_modules[module._id]){
            return <ModuleCard
              key={i}
              module={module}
              showModuleDetailView={this.showModuleDetailView}
            />
          } 
          return null
        })}
      </Masonry>
    )
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

        <div className="container">
          <ReactiveBase
            app="marketplace"
            url={ESURL}
            type="flows"
          >
            <div className="row">
              <div className="col-3">
                <div className="flow-market-sidebar-bordered p-4 mt-2 mb-2">
                  <div className="lg-header">Flows</div>
                  <p className="text-secondary">Flows act as pieces of functionality that you can add to your project. Here's a video on how it works!</p>
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe title="Flow Market Intro" className="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" allowFullScreen></iframe>
                  </div>
                </div>
                <DataSearch
                  componentId="flow-search-box"
                  dataField="title"
                  placeholder="Search for Flows"
                  className="mb-1"
                  innerClass={{
                    input: 'form-control-border search-input form-control flow-market-search'
                  }}
                  showIcon={false}
                />
                <SingleDataList
                  componentId="filter-category"
                  dataField="tag"
                  data={TAGS}
                  placeholder="Category"
                  showSearch={false}
                  customQuery={(value, props) => {return this.filterTags(value, props)}}
                  innerClass={{
                    label: 'flow-radio'
                  }}
                />
              </div>
              <div className="col-9">
                <ReactiveList
                  componentId="result"
                  dataField="model"
                  from={0}
                  size={6}
                  pagination={true}
                  react={{
                    and: ["flow-search-box", "filter-category"]
                  }}
                  showResultStats={false}
                  style={{
                    textAlign: "center",
                    marginLeft: "50px",
                  }}
                  renderAllData={this.renderModules}
                  innerClass = {{
                    pagination: "flow-pagination",
                    label: "text-secondary"
                  }}/>
              </div>
            </div>
				  </ReactiveBase> 
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  project_id: state.skills.skill.project_id,
  user_modules: state.skills.user_modules
})

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRenderModuleIcon(FlowMarket))