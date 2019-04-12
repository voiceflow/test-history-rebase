import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import FlowButton from './components/FlowButton'
import { Button, ButtonGroup, Input } from 'reactstrap'

export class Project extends PureComponent {
    constructor(props) {
        super(props);

        let tab = localStorage.getItem('project_tab')
        if(!tab) tab = 'structure'

        this.state={
            tab: tab,
            filter: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.switchTab = this.switchTab.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    switchTab(tab){
        if(tab !== this.state.tab){
            this.setState({
                tab: tab
            }, ()=>localStorage.setItem('project_tab', tab))
        }
    }

    render() {
      let flow_tab
      if(this.state.tab === 'structure'){
        let unused = []
        for(let diagram of this.props.diagrams){
                if(!this.props.visited.has(diagram.id)){
                    unused.push(
                        <FlowButton
                            key={diagram.id}
                            flow={diagram}
                            enterFlow={this.props.enterFlow}
                            copyFlow={()=>this.props.copyFlow(diagram.id)}
                            deleteFlow={()=>this.props.deleteFlow(diagram.id, this.props.updateTree)}
                        />
                    )
                }
            }
            flow_tab = <React.Fragment>
                <label className='section-title mt-3'>Project Flows</label>
                {this.props.tree}
                {unused.length === 0 ? null : <React.Fragment>
                    <hr className='mb-2 mt-4'/>
                    <label className='section-title mt-3'>Other Flows</label>
                    {unused.map((diagram) => {
                        return diagram;
                    })}
                </React.Fragment>}
            </React.Fragment>
        }else if(this.state.tab === 'flows'){
            flow_tab = <React.Fragment>
                <label className='section-title mt-3'>All Flows</label>
                <Input placeholder="Search Flows" name="filter" value={this.state.filter} onChange={this.handleChange} className="form-control-border mb-3 search-input"/>
                {this.props.diagrams.map(diagram => {
                    if(this.state.filter && !diagram.name.toLowerCase().includes(this.state.filter.toLowerCase())) return null
                    return <FlowButton
                        key={diagram.id}
                        flow={diagram}
                        enterFlow={this.props.enterFlow}
                        copyFlow={()=>this.props.copyFlow(diagram.id)}
                        deleteFlow={()=>this.props.deleteFlow(diagram.id)}
                    />
                })}
            </React.Fragment>
        }
        let unused = []
        for(let diagram of this.props.diagrams){
            if(!this.props.visited.has(diagram.id)){
                unused.push(
                    <FlowButton
                        key={diagram.id}
                        flow={diagram}
                        enterFlow={this.props.enterFlow}
                        copyFlow={()=>this.props.copyFlow(diagram.id)}
                        deleteFlow={()=>this.props.deleteFlow(diagram.id, this.props.updateTree)}
                    />
                )
            }
        }
        return <React.Fragment>
          <ButtonGroup className="toggle-group w-100">
              {TABS.map(tab => {
                  return <Button
                      key={tab}
                      onClick={() => this.switchTab(tab)}
                      outline={this.state.tab !== tab}
                      disabled={this.state.tab === tab}>
                      {tab}
                  </Button>
              })}
          </ButtonGroup>
          {flow_tab}
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    diagrams: state.diagrams.diagrams
})
export default connect(mapStateToProps)(Project);
