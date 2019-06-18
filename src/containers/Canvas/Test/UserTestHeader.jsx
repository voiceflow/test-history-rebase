import React, {useEffect} from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { useToggle } from 'hooks/toggle'

import Button from 'components/Button'
import Header from 'components/Header'
import SecondaryNavBar from "components/NavBar/SecondaryNavBar";

const UserTestHeader = props => {
    const {
        time,
        page,
        skill,
        history,
        dev_skill,
        onTest,
        testing_info,
        resetTest,
        preview
    } = props

    return (
        <>
            <Header
                history={history}
                leftRenderer={() => (
                    <div>
                        <Link to="/" className="mx-3">
                            <img src={"/back.svg"} alt="back" className="mr-3" />
                        </Link>
                        {skill && skill.name ? skill.name : "Loading Skill"}
                    </div>
                )}
                centerRenderer={() => (
                    <div id="middle-group">
                        <label>{moment.utc(time * 1000).format('mm:ss')}</label>
                    </div>
                )}
                rightRenderer={() => (
                    <div>
                        {testing_info
                            ?
                            <Button isBtn isSecondary className="mr-2" onClick={() => {
                                resetTest()
                                history.push(
                                    `/canvas/${dev_skill.skill_id}/${
                                    dev_skill.diagram
                                    }`
                                );
                            }}>Finish Test</Button>
                            :
                            <ReactCSSTransitionGroup
                                transitionName="test_button"
                                transitionEnterTimeout={0}
                                transitionLeaveTimeout={500}
                            >
                                <Button isPrimary className="mr-2" onClick={() => {
                                    onTest()
                                }}>
                                    Start Test
                                    &nbsp;&nbsp;&nbsp;<i className="fas fa-play" />
                                </Button>
                            </ReactCSSTransitionGroup>
                        }
                    </div>
                )}
                subHeaderRenderer={() => (
                    !preview && <SecondaryNavBar page={page} history={history} />
                )}
            />
        </>
    )
}

const mapStateToProps = state => ({
    skill: state.skills.skill,
    dev_skill: state.skills.dev_skill ?
        state.skills.dev_skill :
        state.skills.skill
})

export default connect(mapStateToProps)(UserTestHeader)