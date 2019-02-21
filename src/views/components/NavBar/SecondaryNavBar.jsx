import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import Toggle from 'react-toggle'

const PAGES = ['canvas', 'settings', 'visuals', 'business', 'publish']

class SecondaryNavBar extends Component {
    constructor(props){
        super(props)

        this.state = {
            loading: false,
            platform: this.props.skill.platform
        }

        this.renderItem = this.renderItem.bind(this)
    }

    renderItem(page){
        if(page === 'publish' && this.props.live_mode){
            return <Link to='' key={page} className="nav-item live-mode-disabled" onClick={e => e.preventDefault()}>
                {page}
            </Link>
        }else if(page === this.props.page){
            return <div key={page} className="nav-item active">
                {page}
            </div>
        }else if(this.props.skill){
            let suffix = ''
            if (page === 'settings') {
                suffix = 'basic'
            } else if (page === 'publish') {
                suffix = this.state.platform === 'alexa' ? '' : this.state.platform
            }
            return <Link to={`/${page}/${this.props.skill.skill_id}/${suffix}`} key={page} className="nav-item">
                {page}
            </Link>
        }else{
            return <div key={page} className="nav-item">
                {page}
            </div>
        }
    }

    render(){
        return <React.Fragment>
            <div id="secondary-nav">
            <div>
                {PAGES.map(page => this.renderItem(page))}
            </div>
            <div id="secondary-nav-right-group">
                {!!(this.props.skill && this.props.skill.amzn_id) &&
                    <React.Fragment>
                        {
                            this.props.has_live?
                            <React.Fragment>
                                {
                                    this.props.live_mode ? 
                                    <div className="live-mode-text">
                                        <p>Live</p>
                                    </div>
                                    :
                                    <div className="live-mode-text">
                                        <p>Development</p>
                                    </div>
                                }
                                <Toggle
                                    defaultChecked={this.props.live_mode}
                                    icons={false}
                                    onChange={() => {
                                        this.setState({loading: true})
                                        this.props.toggleLiveMode(() => {
                                            this.setState({loading: false})
                                        })
                                    }}
                                    disabled={this.props.page !== 'canvas' || this.state.loading}
                                />
                            </React.Fragment>
                            :
                            null
                        }

                        {this.props.page === 'logs' ?
                            <div className="nav-item">
                                <img src={'/logs.svg'} alt="logs" width="18"/>
                            </div> :
                            <Link to={`/creator_logs/${this.props.skill.skill_id}`} className="nav-item">
                                <img src={'/logs.svg'} alt="logs" width="18"/>
                            </Link>
                        }
                    </React.Fragment>
                }
            </div>
        </div>
        {this.state.loading && <div id="loading-diagram" style={{zIndex: 100}}>
            <div className="text-center">
                <h5 className="text-muted mb-2">Loading Version</h5>
                <span className="loader"/>
            </div>
        </div>}
        </React.Fragment>
    }
}

export default SecondaryNavBar
