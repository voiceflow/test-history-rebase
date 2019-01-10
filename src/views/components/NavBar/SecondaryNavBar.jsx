import React, {Component} from 'react'
import { Link } from 'react-router-dom'

const PAGES = ['canvas', 'settings', 'visuals', 'business', 'publish'] 

class SecondaryNavBar extends Component {
    constructor(props){
        super(props)

        this.renderItem = this.renderItem.bind(this)
    }

    renderItem(page){
        if(page === this.props.page){
            return <div key={page} className="nav-item active">
                {page}
            </div>
        }else if(this.props.skill){
            return <Link to={`/${page}/${this.props.skill.skill_id}`} key={page} className="nav-item">
                {page}
            </Link>
        }else{
            return <div key={page} className="nav-item">
                {page}
            </div>
        }
    }

    render(){
        return <div id="secondary-nav">
            <div>
                {PAGES.map(page => this.renderItem(page))}
            </div>
            <div>
                {!!(this.props.skill && this.props.skill.amzn_id) &&
                    <React.Fragment>
                        {this.props.page === 'logs' ? 
                            <div className="nav-item-2 active">
                                <i className="far fa-window-alt"/>
                            </div> :
                            <Link to={`/creator_logs/${this.props.skill.skill_id}`} className="nav-item">
                                <i className="far fa-window-alt"/>
                            </Link>
                        }
                    </React.Fragment>
                }
            </div>
        </div>
    }
}

export default SecondaryNavBar
