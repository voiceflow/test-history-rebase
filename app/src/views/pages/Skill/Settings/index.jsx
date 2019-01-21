import React, { Component } from 'react'
import { ButtonGroup, Button } from 'reactstrap'
// SETTING PAGES
import BasicAdvancedSettings from './BasicAdvanced'
import DiscoverySettings from './Discovery'
import BackupSettings from './Backups'

const TABS = ['basic', 'advanced', 'discovery', 'backups']

class Settings extends Component {
    constructor(props) {
        super(props)

        this.modalContent = this.modalContent.bind(this)
        this.switchTab = this.switchTab.bind(this)
    }

    switchTab(tab) {
        if (tab !== this.props.page) {
            this.props.history.push(`/settings/${this.props.skill.skill_id}/${tab}`)
        }
    }

    modalContent() {
        if (!this.props.skill) {
            return null
        }

        switch (this.props.page) {
            case 'basic':
            case 'advanced':
                return <BasicAdvancedSettings {...this.props}/>
            case 'discovery':
                return <DiscoverySettings {...this.props}/>
            case 'backups':
                return <BackupSettings {...this.props}/>
            default:
                return null
        }
    }

    render() {
        return <div id="settings" className="pt-4">
            <div className="nav-bar-top">
                <ButtonGroup className="toggle-group mb-2 toggle-group-settings">
                    {TABS.map(tab => {
                        return <Button
                            key={tab}
                            onClick={() => this.switchTab(tab)}
                            outline={this.props.page !== tab}
                            disabled={this.props.page === tab}>
                            {tab}
                        </Button>
                    })}
                </ButtonGroup>
            </div>

            <div className="settings-content clearfix">
                {this.modalContent()}
            </div>
        </div>
    }
}

export default Settings
