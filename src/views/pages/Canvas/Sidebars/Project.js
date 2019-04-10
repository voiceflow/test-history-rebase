import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import FlowButton from './components/FlowButton'

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
        // TODO this file is cancer going to divide up into different files soon
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
                <label className='section-title mt-1'>Project Flows</label>
                {this.props.tree}
                {unused.length === 0 ? null : <React.Fragment>
                    <hr className='mb-2 mt-4'/>
                    <label className='section-title mt-4'>Other Flows</label>
                    {unused.map((diagram) => {
                        return diagram;
                    })}
                </React.Fragment>}
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    diagrams: state.diagrams.diagrams
})
export default connect(mapStateToProps)(Project);
