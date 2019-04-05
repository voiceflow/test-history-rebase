import React, { Component } from 'react'
import axios from 'axios'
import './Marketplace.css'
import { connect } from 'react-redux'
import ModuleModal from './../../components/Modals/ModuleModal'
import { ReactiveBase, DataSearch, ResultCard, SingleDataList } from '@appbaseio/reactivesearch'
import { TAGS } from './tags'
import withRenderModuleIcon from '../../HOC/ModuleIcon'

const ESURL = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production' ? process.env['ELASTIC_SEARCH_HOST'] : 'http://localhost:9200')

class FlowMarket extends Component {
  constructor(props){
    super(props)

    this.state = {
      modules: [],
      user_modules: new Set(),
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

    axios.get(`/marketplace/user_module/${this.props.project_id}`)
    .then(res => {
      let user_modules = new Set()
      for(let module of res.data){
        user_modules.add(module.module_id)
      }
      this.setState({
        user_modules: user_modules
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

  render() {
    return (
      <div className="marketplace-window justify-content-center">
        <ModuleModal
          isOpen={this.state.show_module_modal} 
          toggle={this.toggleModalView}
          module={this.state.curr_module}
          hideModule={this.hideModule}
        />
        <ReactiveBase
          app="marketplace"
          url={ESURL}
          type="flows"
        >
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
              <div className="flow-market-sidebar-bordered p-4 mt-2 mb-3">
                <div className="lg-header">Flows</div>
                <p className="text-secondary">Flows act as pieces of functionality that you can add to your project. Here's a video on how it works!</p>
                <iframe width="160" height="100" src="https://www.youtube.com/embed/Dk_-DxyiQe4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
                  label: 'text-secondary flow-radio-text'
                }}
              />
						</div>
						<ResultCard
							componentId="result"
              dataField="model"
							from={0}
							size={6}
							pagination={true}
							react={{
								and: ["flow-search-box", "filter-category"]
              }}
              showResultStats={false}
							renderData={(res) => {
								return {
                  description: (
                    <React.Fragment>
                      {this.props.renderIcon(res)}
                      <div className="lg-header" onClick={this.props.onClick}>{res.title}</div>
                      <p className="text-secondary module-card-text">{res.descr}</p>
                      <hr className="m-0"/>
                      <div className="row w-100 space-between mr-0 ml-0 p-3">
                        <span className="align-middle text-secondary">{res.author}</span> 
                        <div><span className="align-middle text-secondary mr-2">{res.downloads}</span><img src={'/downloads.svg'} alt="user" width="16"/></div>
                        </div>
  
                    </React.Fragment>
                  ),
                  containerProps: {
                    onClick: () => {this.showModuleDetailView(res)}
                  }
                }
							}}
							style={{
								width: "80%",
                textAlign: "center"
              }}
            />
					</div>
				</ReactiveBase> 
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

export default connect(mapStateToProps, mapDispatchToProps)(withRenderModuleIcon(FlowMarket))