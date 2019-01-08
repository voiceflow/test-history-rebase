import React, { PureComponent } from 'react'
import { Button, ButtonGroup, Input } from 'reactstrap';
import FlowButton from './components/FlowButton'

const TABS = ['structure', 'flows']

class Project extends PureComponent {
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
        // TODO this file is cancer going to divide up into different files soon
        let flow_tab
        if(this.state.tab === 'structure'){
            let unused = []
            for(let diagram of this.props.diagrams){
                if(!this.props.visited.has(diagram.id)){
                    unused.push(
                        <FlowButton
                            key={diagram.id}
                            flow={diagram}
                            active={this.props.current}
                            enterFlow={this.props.enterFlow}
                            renameFlow={this.props.renameFlow}
                            copyFlow={()=>this.props.copyFlow(diagram.id)}
                            deleteFlow={()=>this.props.deleteFlow(diagram.id)}
                        />
                    )
                }
            }
            flow_tab = <React.Fragment>
                <label className='section-title mt-4'>Project Flows</label>
                {this.props.tree}
                {unused.length === 0 ? null : <React.Fragment>
                    <hr className='mb-2 mt-4'/>
                    <label className='section-title mt-4'>Other Flows</label>
                    {unused.map((diagram) => {
                        return diagram;
                    })}
                </React.Fragment>}
            </React.Fragment>
        }else if(this.state.tab === 'flows'){
            flow_tab = <React.Fragment>
                <label className='section-title mt-4'>All Flows</label>
                <Input placeholder="Search Flows" name="filter" value={this.state.filter} onChange={this.handleChange} className="form-control-border mb-3 search-input"/>
                {this.props.diagrams.map(diagram => {
                    if(this.state.filter && !diagram.name.toLowerCase().includes(this.state.filter.toLowerCase())) return null
                    return <FlowButton
                        key={diagram.id}
                        flow={diagram}
                        active={this.props.current}
                        enterFlow={this.props.enterFlow}
                        renameFlow={this.props.renameFlow}
                        copyFlow={()=>this.props.copyFlow(diagram.id)}
                        deleteFlow={()=>this.props.deleteFlow(diagram.id)}
                    />
                })}
            </React.Fragment>
        }

        return <React.Fragment>
            <ButtonGroup className="toggle-group mb-2">
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
            {/*<label>Templates</label>
            {this.props.user_templates.length > 0?
                <div>
                {this.props.user_templates.map((user_template, i) => {
                    return <TemplateItem onTemplateChoice={this.props.onTemplateChoice} module={user_template} key={i} />;
                })}
                </div>
                :
                <div className="text-muted">You have no templates <span role="img" aria-label="crying emoji">😭</span> visit <Button color="link" className="pl-0 pr-0 pt-0 pb-0" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button> to get some!</div>
            }*/}
        </React.Fragment>
    }
}

export default Project;
