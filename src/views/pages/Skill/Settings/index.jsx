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
        return <div className="settings pt-4 pb-5">
            <div className="nav-bar-top mb-4">
                <ButtonGroup className="toggle-group mb-2 toggle-group-settings">
                    {TABS.map(tab => {
                        return <Button
                            key={tab}
                            onClick={() => this.switchTab(tab)}
                            outline={this.props.page !== tab}
                            disabled={this.props.page === tab || (this.props.live_mode && tab === 'backups')}>
                            {tab}
                        </Button>
                    })}
                </ButtonGroup>
            </div>
            {this.modalContent()}
        </div>
    }
}

export default Settings
