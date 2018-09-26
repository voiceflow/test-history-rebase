/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import AuthenticationService from './../../../services/Authentication';

class Environments extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: AuthenticationService.getUser()
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle(type){
    if(type === this.props.env){
      this.props.update('');
    }else{
      this.props.update(type);
    }
  }

  render() {
    return (
      <div className={"rotate cols" + (this.props.noedge ? ' rotate-noedge' :'')}>
        {
          this.state.user.admin ? <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
            <div onClick={() => this.toggle("staging")} className={"container" + (this.props.env === 'staging' ? " selected" : "")}>
              <div className="front sandbox">
                <div className="inner">
                  <h1>Staging</h1>
                </div>
              </div>
              <div className="back">
                <div className="inner">
                  <p>You know what this is</p>
                </div>
              </div>
            </div>
          </div> : null
        }
        <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
          <div onClick={() => this.toggle("sandbox")} className={"container" + (this.props.env === 'sandbox' ? " selected" : "")}>
            <div className="front sandbox">
              <div className="inner">
                <img src="/images/logo_sandbox.png" alt="sandbox"/>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>Playground for any type of content</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
          <div onClick={() => this.toggle("production")} className={"container" + (this.props.env === 'production' ? " selected" : "")}>
            <div className="front storyflow">
              <div className="inner">
                <img src="/images/logo_storyflow.png" alt="storyflow"/>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>Professional Approved Content</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
          <div onClick={() => this.toggle("kids")} className={"container" + (this.props.env === 'kids' ? " selected" : "")}>
            <div className="front kids">
              <div className="inner">
                <img src="/images/logo_storyflow.png" alt="storyflow"/>
                <h2>Kids</h2>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>Content for children and family</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Environments;