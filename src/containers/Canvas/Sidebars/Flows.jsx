import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import FlowButton from './components/FlowButton'
import { Button, ButtonGroup, Input } from 'reactstrap'

export class Flows extends PureComponent {
    constructor(props) {
        super(props);

        this.state={
            filter: ''
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="search-section">
                    <label className='section-title mt-3'>All Flows</label>
                    <Input placeholder="Search Flows" name="filter" value={this.state.filter} onChange={this.handleChange} className="form-control-border mb-3 search-input"/>
                </div>
                <div className="flows-list">
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
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    diagrams: state.diagrams.diagrams
})
export default connect(mapStateToProps)(Flows);
