import React, { Component } from 'react'
import _ from 'lodash'

export default class SearchableDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFilter: ''
        }
    }

    onSearchChange = (e) => {
        this.setState({
            searchFilter: e.target.value
        })
    }

    render() {
        return (
            <div className="search__dropdown">
                <div id="myDropdown" class="search__dropdown_content">
                    <input type="text" placeholder="Search..." id="myInput" onChange={this.onSearchChange} onKeyUp={e => e.stopPropagation()} />
                    
                    {this.state.searchFilter !== '' ?
                        _.filter(this.props.options, option => 
                            _.includes(_.toLower(option.label), _.toLower(this.state.searchFilter))
                        ).map((item, idx) => 
                            <div key={idx} className="dropdown_option" onClick={() => this.props.onChange(item)}>{item.label}</div>
                        ):
                        this.props.options.map((item, idx) =>
                            <div key={idx} className="dropdown_option" onClick={() => this.props.onChange(item)}>{item.label}</div>
                        )
                    }
                </div>
            </div>
        )
    }
}