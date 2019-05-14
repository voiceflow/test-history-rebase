import cn from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setConfirm, clearModal, setError } from 'ducks/modal'
import { Collapse } from 'reactstrap'
import update from 'immutability-helper/index';

import DefaultModal from 'components/Modals/DefaultModal'
import { deleteIntegrationUser } from 'ducks/integration'

// props
// selected_integration, user, integration_data, updateIntegrationData, showNextSection, user_modal, action_data, toggleSection, open

class UserSection extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.checkCompletion()
  }

  checkCompletion() {
    let completed = false

    if (this.props.integrationsUser) {
      completed = true
    }

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
  }

  selectUser(user) {
    if (!user) return

    const userChanged = user.user_id !== (this.props.integration_data.user && this.props.integration_data.user.user_id)
    const newIntegrationData = update(this.props.integration_data, {
      user: {
        $set: user
      }
    })

    this.setState({
      completed: true
    })
    if (this.props.userChanged && userChanged) {
      this.props.updateIntegrationData(newIntegrationData, () => this.props.userChanged())
    } else {
      this.props.updateIntegrationData(newIntegrationData)
    }
    this.props.showNextSection()
  }

  deleteUser(ev, user) {
    // TODO: fix
    ev.stopPropagation()

    this.props.setConfirm({
      text: 'Are you sure you want to remove this user?',
      confirm: async () => {
        this.props.clearModal()

        try {
          await this.props.deleteUser(this.props.selected_integration, {
            user: user,
            creator_id: this.props.user.creator_id,
            skill_id: this.props.skill_id
          })
          if (this.props.integration_user_error) {
            this.props.setError(this.props.integration_user_error)
          } else {
            this.props.setConfirm({
              text: 'User deleted successfully.', confirm: () => { this.props.clearModal(); this.forceUpdate() }
            })
            const newIntegrationData = update(this.props.integration_data, {
              user: {
                $set: null
              }
            })
            this.props.updateIntegrationData(newIntegrationData, () => { this.forceUpdate(); this.checkCompletion() })
          }
        } catch (e) {
          this.props.setError(e)
        }
      }
    })
  }

  addUser() {
    this.setState({
      add_user_modal: true
    })
  }

  render() {
    const integration = this.props.selected_integration
    const users = this.props.integration_users[integration]
    const user = this.props.integrationsUser

    const AddUserModal = this.props.user_modal

    if (!this.props.action_data) return null

    return (<>
      {AddUserModal && <DefaultModal
        open={this.state.add_user_modal && !this.state.integration_users_loading}
        header="Connect Google Account"
        toggle={() =>
          this.setState({
            add_user_modal: !this.state.add_user_modal
          })
        }
        content={
          <AddUserModal
            toggle={() =>
              this.setState({
                add_user_modal: !this.state.add_user_modal
              })}
            onError={(e) => this.props.setError(e)}
            onSuccess={() => {

              if (this.props.integration_user_error) {
                this.props.setError(this.props.integration_user_error)
                return
              }

              const integration = this.props.selected_integration
              const users = this.props.integration_users[integration]

              const newIntegrationData = update(this.props.integration_data, {
                user: {
                  $set: users[users.length - 1]
                }
              })
              this.props.updateIntegrationData(newIntegrationData)
              this.setState({
                add_user_modal: false,
                completed: true
              })
              this.props.setConfirm({
                text: 'Your new user has been added successfully!', confirm: () => this.props.clearModal()
              })
            }}
            onBegin={() =>
              this.setState({
                add_user_modal: false
              })}
            skill_id={this.props.skill_id} />
        }
        hideFooter={true}
        noPadding={true}
      />}
      <div className="d-flex flex-column section-title-container" onClick={() => this.props.toggleSection()}>
        <div className='integrations-section-title text-muted'>As user
          <span
            className={cn('action-selected', {
              'action-visible': user && user.user_data && user.user_data.email
            })}
            onClick={() => this.props.toggleSection()}
          >
            {user && user.user_data && user.user_data.email}
          </span>
          {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
        </div>
      </div>
      <Collapse isOpen={this.props.open} className='w-100'>
        <div className='d-flex align-items-center flex-column w-100 actions-section'>
          {!this.props.integration_users_loading && users && users.map((e, i) => {
            return (
              <div key={i}
                className={cn('btn', 'btn-clear', 'btn-block', {
                  active: user && user.user_id === e.user_id
                })}
                onClick={() => this.selectUser(e)}
              >
                <div className='close mt-3' onClick={(ev) => this.deleteUser(ev, e)}></div>
                <div className='d-flex flex-row'>
                  <div className='flex-row align-self-center'>
                  </div>
                  <div className="text-left">
                    <b>
                      {e.user_data && e.user_data.name}
                    </b>
                    <br />
                    <small>
                      {e.user_data && e.user_data.email}
                    </small>
                  </div>
                </div>

              </div>
            )
          })}
          {this.props.integration_users_loading && <div className="text-center my-4"><div className='loader text-lg' /></div>}
          <div className={`btn btn-clear btn-lg btn-block`} onClick={() => this.addUser()}>
            <span><i className='far fa-plus mr-2'></i></span>  Add User
        </div>
        </div>
      </Collapse>
    </>
    )
  }
}

const mapStateToProps = state => ({
  integration_users: state.integrationUsers.integration_users,
  integration_users_loading: state.integrationUsers.loading,
  integration_user_error: state.integrationUsers.error,
  skill_id: state.skills.skill.skill_id,
  user: state.account
})

const mapDispatchToProps = dispatch => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    clearModal: () => dispatch(clearModal()),
    setError: (error) => dispatch(setError(error)),
    deleteUser: (integration, data) => dispatch(deleteIntegrationUser(integration, data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSection)
