import React, { Component } from 'react'
import AuthenticationService from './../../../services/Authentication'
import ConfirmModal from './../../components/Modals/ConfirmModal'
import {Alert, Button} from 'reactstrap'
import axios from 'axios'

const UNLINKED = 0
const LOADING = 1
const LINKED = 2

class Account extends Component {

  constructor(props) {
    super(props);

    this.state = {
      amzn: LOADING,
      confirm: null
    };

    this.handleChange = this.handleChange.bind(this)
    this.resetAmazon = this.resetAmazon.bind(this)
  }

  resetAmazon() {
    this.setState({
      confirm: {
        text: <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x"/><br/>
          Resetting your Amazon Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing
        </Alert>,
        confirm: () => {
          this.setState({confirm: null, amzn: LOADING}, () => {
            axios.delete('/session/amazon').then(()=>{
              this.setState({amzn: UNLINKED})
            })
            .catch(err => {
              this.setState({amzn: LINKED})
              alert('Failed to Delete Amazon Account Association =')
            })
          })
        }
      }
    })
  }

  componentDidMount() {
      AuthenticationService.AmazonAccessToken(token => {
          this.setState({
              amzn: !!token ? LINKED : UNLINKED
          });
      });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  renderButton(stage, action){
    switch(stage){
      case LOADING:
        return <Button color="clear"><span className="loader"/></Button>
      case UNLINKED:
        return <Button color="clear" disabled>Unlinked</Button>
      default:
        return <Button onClick={action}>Reset</Button>
    }
  }

  render() {
    return <div className='Window'>
              <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})} warning/>
              <div className="subheader">
                  <div className="container space-between">
                      <span className="subheader-title">
                          <b>Account</b>
                          <div className="hr-label">
                              <small><i className="far fa-user mr-1"></i></small>{' '}
                              {this.props.user.name}{' '}
                          </div>
                      </span>
                  </div>
              </div>
              <div className="container my-5 pt-5">
                  <h5 className="ml-3">Developer Integration</h5>
                  <div className="card">
                    <div className="p-4 space-between">
                      <h4 className="mb-0 text-muted">Amazon</h4>
                      <div className="super-center">
                        {this.renderButton(this.state.amzn, this.resetAmazon)}
                      </div>
                    </div>
                  </div>
              </div>
            </div>
  }
}

export default Account;
