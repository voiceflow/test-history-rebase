import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setConfirm, setError } from 'ducks/modal'
import { AmazonAccessToken, googleAccessToken, updateAccount } from 'ducks/account'
import { Alert } from 'reactstrap'
import moment from 'moment'
import axios from 'axios'
import './Account.css'
import Image from 'views/components/Uploads/Image'

const UNLINKED = 0
const LOADING = 1
const LINKED = 2

class Account extends Component {

  constructor(props) {
    super(props)

    this.state = {
      amzn: LOADING,
      google: LOADING,
      expiry: null,
    };

    this.handleChange = this.handleChange.bind(this)
    this.uploadProfile = this.uploadProfile.bind(this)
    this.toggle = this.toggle.bind(this)
    this.resetAmazon = this.resetAmazon.bind(this)
    this.resetGoogle = this.resetGoogle.bind(this)

    if(props.user.expiry) this.expiry = moment.unix(props.user.expiry).fromNow()
  }

  resetAmazon() {
    this.props.setConfirm({
        text: <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x"/><br/>
          Resetting your Amazon Account is dangerous and will de-sync all your published projects/versions and can lead to live skills being deleted. Do not reset unless you know what you are doing
        </Alert>,
        warning: true,
        confirm: () => {
          this.setState({amzn: LOADING}, () => {
            axios.delete('/session/amazon').then(()=>{
              this.setState({amzn: UNLINKED, profile: null})
            })
            .catch(err => {
              this.setState({amzn: LINKED})
              alert('Failed to Delete Amazon Account Association =')
            })
          })
        }
    })
  }

  resetGoogle() {
    this.props.setConfirm({
        text: <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x"/><br/>
          Resetting your Google Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing
        </Alert>,
        warning: true,
        confirm: () => {
          this.setState({google: LOADING}, () => {
            axios.delete('/session/google/access_token').then(()=>{
              this.setState({google: UNLINKED})
            })
            .catch(err => {
              this.setState({google: LINKED})
              alert('Failed to unlink Google Account')
            })
          })
        }
    })
  }

  componentDidMount() {
    AmazonAccessToken()
    .then(data => {
      if(data){
        this.setState({
            amzn: !!data.token ? LINKED : UNLINKED,
            token: data.token,
            profile: data.profile
        })
      } else {
        throw new Error()
      }
    })
    .catch(() => {
      this.setState({
        amzn: UNLINKED,
      })
    })

    googleAccessToken().then(g_token => {
      this.setState({
        google: !!g_token ? LINKED : UNLINKED
      })
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  toggle() {
    if(this.props.upgrade){
      this.props.history.push('/account')
    }else{
      this.props.history.push('/account/upgrade')
    }
  }

  renderButton(stage, action){
    switch(stage){
      case LOADING:
        return <button className="btn-primary disabled"><span className="loader"/></button>
      case UNLINKED:
        return <button className="btn-primary disabled" disabled>Unlinked</button>
      default:
        return <button onClick={action} className="btn-primary">Reset</button>
    }
  }

  uploadProfile(url) {
    this.props.updateAccount({image: url})
  }

  render() {
    return <div id="app" className="pt-6">
              <div className="container my-5 pt-4">
                <h5 className="ml-3">Profile</h5>
                <div className="mb-5 card d-flex flex-row p-4">
                  <Image
                    className='icon-image large-icon mr-4'
                    path='/user/profile/picture'
                    image={this.props.user.image}
                    update={this.uploadProfile}
                    replace
                  />
                  <div className="helper-text super-center border-left pl-4">
                    <div className="col-0">
                      Name:<br/>
                      Email:<br/>
                      Joined:<br/>
                    </div>
                    <div className="col-sm">
                      {this.props.user.name}<br/>
                      {this.props.user.email}<br/>
                      {moment(this.props.user.created).format('MMMM Do, YYYY')}<br/>
                    </div>
                  </div>
                </div>
                <h5 className="ml-3">Developer Integration</h5>
                <div className="card mb-5">
                  <div className={!!this.state.profile ? "pl-4 pr-4 pt-4 space-between" : "p-4 space-between"}>
                    <h4 className="mb-0 text-muted">Amazon</h4>
                    <div className="super-center">
                      {this.renderButton(this.state.amzn, this.resetAmazon)}
                    </div>
                  </div>
                  {this.state.profile &&
                    <React.Fragment>
                      <hr/>
                      <div className="pl-4 pb-4 pr-4 space-between helper-text">
                        <div className="col-0">
                          Name:<br/>
                          Email:<br/>
                          User Id:<br/>
                        </div>
                        <div className="col-sm">
                          {this.state.profile.name}<br/>
                          {this.state.profile.email}<br/>
                          {this.state.profile.user_id}<br/>
                        </div>
                      </div>
                    </React.Fragment>
                  }
                </div>
                <div className="card mb-5">
                  <div className="p-4 space-between">
                    <h4 className="mb-0 text-muted">Google</h4>
                    <div className="super-center">
                      {this.renderButton(this.state.google, this.resetGoogle)}
                    </div>
                  </div>
                </div>
              </div>
          </div>
  }
}

const mapStateToProps = state => ({
  user: state.account
})

const mapDispatchToProps = dispatch => {
  return {
    setConfirm: confirm => dispatch(setConfirm(confirm)),
    setError: error => dispatch(setError(error)),
    updateAccount: payload => dispatch(updateAccount(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Account);
