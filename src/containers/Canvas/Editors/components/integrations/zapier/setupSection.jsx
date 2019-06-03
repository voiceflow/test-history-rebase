import React, { Component } from 'react'
import { Collapse, InputGroup, InputGroupAddon, Input} from 'reactstrap'

import Button from 'components/Button'
import ClipBoard from 'components/ClipBoard/ClipBoard'

var zapierInviteEndpoint;
if (process.env.REACT_APP_BUILD_ENV === 'staging' || process.env.NODE_ENV !== 'production') {
  zapierInviteEndpoint = 'https://zapier.com/developer/public-invite/21201/642d361378b287979f713057f57e5473/'
} else {
  zapierInviteEndpoint = 'https://zapier.com/developer/public-invite/20085/7eccd63d8c656ef77db11cdc63c42fa4/'
}

// props
// action_data, open, headers_loading, sheet_headers, toggleSection, variables, showNextSection

class SetupSection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const feed = this.props.integrationsUser && this.props.integrationsUser.user_id
    return (
      <>
        <div className={`d-flex flex-column section-title-container`} onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>
            Zapier Setup
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <div className='d-flex flex-column mb-3 text-dark'>
            <div className='d-flex flex-row w-100 align-items-center'>
                <div className="d-flex flex-fill" style={{ overflow: "auto" }}>
                  <ol>
                  <li className="mb-3">Join the Voiceflow Zapier Beta <a href={zapierInviteEndpoint} target="_blank" rel="noopener noreferrer">here</a></li>
                  <li className="mb-3">Create a Zap using trigger app <b>Voiceflow</b></li>
                  <li className="mb-3">Connect your account with this API key
                  <InputGroup className="mt-1">
                    <InputGroupAddon addonType="prepend">
                      <ClipBoard
                        component="button"
                        className="btn btn-clear copy-link"
                        value={this.props.apiKey}
                        id="shareKey"
                      >
                        <i className="fas fa-copy" />
                      </ClipBoard>
                    </InputGroupAddon>
                    <Input readOnly value={this.props.apiKey} className="form-control-border right" />
                  </InputGroup>
                  </li>
                  <li>Select trigger <code>{feed}</code></li>
                  </ol>
                </div>
              </div>
          </div>
          {!this.props.headers_loading && <div className="text-center my-3"><Button isFlat onClick={this.props.showNextSection}>Next</Button></div>}
        </Collapse>
      </>
    )
  }
}

export default SetupSection
