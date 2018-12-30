import React, {Component} from 'react'
import { Link } from 'react-router-dom'

const PAGES = ['canvas', 'business', 'settings', 'publish'] 

class SecondaryNavBar extends Component {
    render(){
        return <div id="secondary-nav">
            {
                PAGES.map(page => {
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
                })
            }
        </div>
    }
}

export default SecondaryNavBar