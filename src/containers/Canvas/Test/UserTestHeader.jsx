import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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
        onTest,
        resetTest,
        beginTest,
        preview
    } = props

    const [isTesting, toggleTesting] = useToggle();
    
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
                        <h3>{moment.utc(time * 1000).format('mm:ss')}</h3>
                    </div>
                )}
                rightRenderer={() => (
                    <div>
                        {isTesting
                            ?
                            <Button isBtn isSecondary className="mr-2" onClick={() => {
                                toggleTesting()
                                resetTest()
                            }}>Finish Test</Button>
                            :
                            <Button isPrimary className="mr-2" onClick={() => {
                                onTest()
                                toggleTesting()
                            }}>
                                Start Test
                                &nbsp;&nbsp;&nbsp;<i className="fas fa-play" />
                            </Button>
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
})

export default connect(mapStateToProps)(UserTestHeader)