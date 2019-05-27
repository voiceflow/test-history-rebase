import React, { Component } from 'react'
import { Collapse, InputGroup, InputGroupAddon, Input} from 'reactstrap'

import Button from 'components/Button'
import ClipBoard from 'components/ClipBoard/ClipBoard'


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
          <div className='integrations-section-title text-muted'>Zapier Setup
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <div className='d-flex flex-column mb-3 text-dark'>
            <div className='d-flex flex-row w-100 mb-3 align-items-center'>
                <div className="d-flex flex-fill" style={{ overflow: "auto" }}>
                  <ol>
                  <li>Join the Voiceflow Zapier Beta <a href="https://zapier.com/developer/public-invite/20085/7eccd63d8c656ef77db11cdc63c42fa4/" target="_blank" rel="noopener noreferrer">here</a></li>
                  <li>Connect your account with this API key
                  <InputGroup>
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
                  <li>Create a Zap using the trigger <code>{feed}</code></li>
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
